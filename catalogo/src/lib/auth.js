import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { initDb } from "@/lib/db";
import { getAppBaseUrl } from "@/lib/env";

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function validatePassword(password = "") {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "La contraseña debe incluir letras y números.";
  }

  return "";
}

function buildAppUrl(pathname) {
  return new URL(pathname, getAppBaseUrl()).toString();
}

async function findUserByEmail(email) {
  await initDb();

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const { rows } = await sql`
    SELECT
      id,
      name,
      email,
      password,
      role,
      email_verified_at,
      is_pending_verification,
      auth_provider
    FROM users
    WHERE email = ${normalizedEmail}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

async function ensureOAuthUser(user, provider = "oauth") {
  const normalizedEmail = normalizeEmail(user?.email);

  if (!normalizedEmail) {
    return null;
  }

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const nextName = user?.name?.trim();

    if (
      nextName &&
      (nextName !== existingUser.name ||
        existingUser.is_pending_verification ||
        !existingUser.email_verified_at ||
        existingUser.auth_provider !== provider)
    ) {
      await sql`
        UPDATE users
        SET name = ${nextName}
        WHERE id = ${existingUser.id}
      `;
    }

    await sql`
      UPDATE users
      SET
        is_pending_verification = FALSE,
        email_verified_at = COALESCE(email_verified_at, NOW()),
        auth_provider = ${provider}
      WHERE id = ${existingUser.id}
    `;

    return existingUser;
  }

  const placeholderPassword = await bcrypt.hash(crypto.randomUUID(), 10);
  const displayName = user?.name?.trim() || normalizedEmail;

  await sql`
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
      ${displayName},
      ${normalizedEmail},
      ${placeholderPassword},
      'user',
      ${provider},
      FALSE,
      NOW()
    )
  `;

  return findUserByEmail(normalizedEmail);
}

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: {
        label: "Email",
        type: "email",
        placeholder: "correo@ejemplo.com",
      },
      password: { label: "Contraseña", type: "password" },
    },
    async authorize(credentials) {
      try {
        const normalizedEmail = normalizeEmail(credentials?.email);
        const password = credentials?.password;

        if (!normalizedEmail || !password) {
          return null;
        }

        const user = await findUserByEmail(normalizedEmail);

        if (!user?.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        if (user.is_pending_verification) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        if (error instanceof Error && error.message === "EMAIL_NOT_VERIFIED") {
          throw error;
        }

        console.error("Error querying users from database", error);
        return null;
      }
    },
  })
);

export const authOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        if (!user?.email) {
          return false;
        }

        await ensureOAuthUser(user, account?.provider || "oauth");
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user || !token.id || !token.role || token.pendingVerification === undefined) {
        const dbUser = await findUserByEmail(user?.email || token?.email);

        if (dbUser) {
          token.id = dbUser.id.toString();
          token.role = dbUser.role || "user";
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.pendingVerification = Boolean(dbUser.is_pending_verification);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
        session.user.pendingVerification = Boolean(token.pendingVerification);
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "development"
      ? "kareh-dev-secret-change-me"
      : undefined),
};

export async function getServerAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para continuar." },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "No tienes permisos para acceder a este recurso." },
      { status: 403 }
    );
  }

  return null;
}

export {
  buildAppUrl,
  findUserByEmail,
  normalizeEmail,
  validatePassword,
};
