import { sql } from '@vercel/postgres';

let dbInitPromise;

async function applySchema() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS is_pending_verification BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'credentials';
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        stock INTEGER DEFAULT 0,
        cost_price DECIMAL(10, 2) DEFAULT 0,
        cash_price DECIMAL(10, 2) DEFAULT 0,
        transfer_price DECIMAL(10, 2) DEFAULT 0,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create sales table
    await sql`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        customer_phone VARCHAR(255),
        items JSONB NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        source VARCHAR(50) NOT NULL, -- 'web' or 'local'
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create auth tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        token_hash VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        consumed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS auth_tokens_user_type_idx
      ON auth_tokens (user_id, type, consumed_at);
    `;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

export async function initDb() {
  if (!dbInitPromise) {
    dbInitPromise = applySchema().catch((error) => {
      dbInitPromise = undefined;
      throw error;
    });
  }

  return dbInitPromise;
}
