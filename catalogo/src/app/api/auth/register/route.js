import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  normalizeEmail,
  validatePassword,
} from "@/lib/auth";
import { createAuthToken } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/auth-email";
import { isMailerConfigured } from "@/lib/mailer";

export async function POST(request) {
  try {
    if (!isMailerConfigured()) {
      return NextResponse.json(
        {
          error:
            "El correo de validación no está configurado todavía. Completa la configuración SMTP.",
        },
        { status: 500 }
      );
    }

    const { name, email, password } = await request.json();
    const normalizedName = name?.trim() || "";
    const normalizedEmail = normalizeEmail(email);
    const passwordError = validatePassword(password);

    if (!normalizedName || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await findUserByEmail(normalizedEmail);
    let userId;

    if (existingUser) {
      if (!existingUser.is_pending_verification) {
        return NextResponse.json(
          { error: "Ese correo ya está registrado." },
          { status: 409 }
        );
      }

      await sql`
        UPDATE users
        SET
          name = ${normalizedName},
          password = ${hashedPassword},
          auth_provider = 'credentials',
          is_pending_verification = TRUE,
          email_verified_at = NULL
        WHERE id = ${existingUser.id}
      `;

      userId = existingUser.id;
    } else {
      const { rows } = await sql`
        INSERT INTO users (
          name,
          email,
          password,
          role,
          auth_provider,
          is_pending_verification,
          email_verified_at
        )
        VALUES (
          ${normalizedName},
          ${normalizedEmail},
          ${hashedPassword},
          'user',
          'credentials',
          TRUE,
          NULL
        )
        RETURNING id
      `;

      userId = rows[0].id;
    }

    const verificationToken = await createAuthToken(userId, "verify_email");

    await sendVerificationEmail({
      email: normalizedEmail,
      name: normalizedName,
      token: verificationToken,
    });

    return NextResponse.json(
      {
        message:
          "Te enviamos un correo para validar tu cuenta. Revisa tu bandeja de entrada.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "No pudimos registrar la cuenta en este momento." },
      { status: 500 }
    );
  }
}
