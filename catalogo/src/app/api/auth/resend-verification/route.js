import { NextResponse } from "next/server";
import { findUserByEmail, normalizeEmail } from "@/lib/auth";
import { createAuthToken } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/auth-email";
import { isMailerConfigured } from "@/lib/mailer";

const SUCCESS_MESSAGE =
  "Si el correo existe y sigue pendiente de validación, te enviamos un nuevo enlace.";

export async function POST(request) {
  try {
    if (!isMailerConfigured()) {
      return NextResponse.json(
        { error: "El envío de correos no está configurado todavía." },
        { status: 500 }
      );
    }

    const { email } = await request.json();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    const user = await findUserByEmail(normalizedEmail);

    if (!user || !user.is_pending_verification) {
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    const token = await createAuthToken(user.id, "verify_email");

    await sendVerificationEmail({
      email: normalizedEmail,
      name: user.name,
      token,
    });

    return NextResponse.json({ message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "No pudimos reenviar la validación." },
      { status: 500 }
    );
  }
}
