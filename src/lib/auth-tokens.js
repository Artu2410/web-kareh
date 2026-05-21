import crypto from "crypto";
import { sql } from "@vercel/postgres";
import { initDb } from "@/lib/db";

const TOKEN_TTL_MINUTES = {
  verify_email: 24 * 60,
  reset_password: 60,
};

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getExpirationDate(type) {
  const ttlMinutes = TOKEN_TTL_MINUTES[type] || 60;
  return new Date(Date.now() + ttlMinutes * 60 * 1000);
}

export async function createAuthToken(userId, type) {
  await initDb();

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = getExpirationDate(type);

  await sql`
    DELETE FROM auth_tokens
    WHERE user_id = ${userId}
      AND type = ${type}
      AND consumed_at IS NULL
  `;

  await sql`
    INSERT INTO auth_tokens (user_id, type, token_hash, expires_at)
    VALUES (${userId}, ${type}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  return rawToken;
}

export async function consumeAuthToken(rawToken, type) {
  await initDb();

  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);

  const { rows } = await sql`
    SELECT id, user_id, type, expires_at, consumed_at
    FROM auth_tokens
    WHERE token_hash = ${tokenHash}
      AND type = ${type}
    LIMIT 1
  `;

  const tokenRow = rows[0];

  if (!tokenRow) {
    return null;
  }

  if (tokenRow.consumed_at || new Date(tokenRow.expires_at) < new Date()) {
    return null;
  }

  await sql`
    UPDATE auth_tokens
    SET consumed_at = NOW()
    WHERE id = ${tokenRow.id}
  `;

  return tokenRow;
}

export async function clearAuthTokens(userId, types = []) {
  await initDb();

  if (!types.length) {
    await sql`DELETE FROM auth_tokens WHERE user_id = ${userId}`;
    return;
  }

  await sql`
    DELETE FROM auth_tokens
    WHERE user_id = ${userId}
      AND type = ANY(${types})
  `;
}
