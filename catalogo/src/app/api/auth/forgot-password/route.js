import { NextResponse } from "next/server";
import { findUserByEmail, normalizeEmail } from "@/lib/auth";
import { createAuthToken } from "@/lib/auth-tokens";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/auth-email";
import { isMailerConfigured } from "@/lib/mailer";

const SUCCESS_MESSAGE =
  "Si el correo existe, te enviamos instrucciones para continuar.";

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

    if (!user) {
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    if (user.is_pending_verification) {
      const verificationToken = await createAuthToken(user.id, "verify_email");

      await sendVerificationEmail({
        email: normalizedEmail,
        name: user.name,
        token: verificationToken,
      });

      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    const resetToken = await createAuthToken(user.id, "reset_password");

    await sendPasswordResetEmail({
      email: normalizedEmail,
      name: user.name,
      token: resetToken,
    });

    return NextResponse.json({ message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "No pudimos iniciar la recuperación de contraseña." },
      { status: 500 }
    );
  }
}
