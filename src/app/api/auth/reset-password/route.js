import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/auth";
import { clearAuthTokens, consumeAuthToken } from "@/lib/auth-tokens";

export async function POST(request) {
  try {
    const { token, password } = await request.json();
    const passwordError = validatePassword(password);

    if (!token || !password) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const tokenRow = await consumeAuthToken(token, "reset_password");

    if (!tokenRow) {
      return NextResponse.json(
        { error: "El enlace para restablecer la contraseña ya no es válido." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      UPDATE users
      SET
        password = ${hashedPassword},
        auth_provider = 'credentials'
      WHERE id = ${tokenRow.user_id}
    `;

    await clearAuthTokens(tokenRow.user_id, ["reset_password"]);

    return NextResponse.json({
      message: "Tu contraseña fue actualizada correctamente.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "No pudimos cambiar tu contraseña." },
      { status: 500 }
    );
  }
}
