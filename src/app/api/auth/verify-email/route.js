import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { clearAuthTokens, consumeAuthToken } from "@/lib/auth-tokens";

function redirectWithParams(request, params) {
  const url = new URL("/login", request.url);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return NextResponse.redirect(url);
}

export async function GET(request) {
  try {
    const token = new URL(request.url).searchParams.get("token");

    if (!token) {
      return redirectWithParams(request, { error: "VERIFICATION_LINK_INVALID" });
    }

    const tokenRow = await consumeAuthToken(token, "verify_email");

    if (!tokenRow) {
      return redirectWithParams(request, { error: "VERIFICATION_LINK_INVALID" });
    }

    await sql`
      UPDATE users
      SET
        is_pending_verification = FALSE,
        email_verified_at = COALESCE(email_verified_at, NOW()),
        auth_provider = COALESCE(auth_provider, 'credentials')
      WHERE id = ${tokenRow.user_id}
    `;

    await clearAuthTokens(tokenRow.user_id, ["verify_email"]);

    return redirectWithParams(request, { verified: "1" });
  } catch (error) {
    console.error("Verify email error:", error);
    return redirectWithParams(request, { error: "VERIFICATION_LINK_INVALID" });
  }
}
