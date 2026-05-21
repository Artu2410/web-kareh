import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs/promises';
import path from 'path';
import { initDb } from '@/lib/db';
import { isMigrationSecretValid } from '@/lib/env';

export const dynamic = 'force-dynamic';

async function loadSeedData(filename) {
  const filePath = path.join(process.cwd(), 'data', filename);
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function POST(request) {
  try {
    if (!isMigrationSecretValid(request)) {
      return NextResponse.json(
        { error: 'Invalid migration secret.' },
        { status: 401 }
      );
    }

    await initDb();
    const client = await sql.connect();

    try {
      await client.sql`BEGIN`;

      const userCountResult = await client.sql`
        SELECT COUNT(*)::int AS count
        FROM users
      `;
      const productCountResult = await client.sql`
        SELECT COUNT(*)::int AS count
        FROM products
      `;

      const userCount = Number(userCountResult.rows[0]?.count || 0);
      const productCount = Number(productCountResult.rows[0]?.count || 0);

      let seededUsers = 0;
      let seededProducts = 0;

      if (userCount === 0) {
        const usersData = await loadSeedData('users.json');

        for (const user of usersData) {
          await client.sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${user.name}, ${user.email}, ${user.password}, ${user.role})
            ON CONFLICT (email) DO NOTHING
          `;
          seededUsers += 1;
        }
      }

      if (productCount === 0) {
        const productsData = await loadSeedData('products.json');

        for (const product of productsData) {
          await client.sql`
            INSERT INTO products (
              name,
              description,
              stock,
              cost_price,
              cash_price,
              transfer_price,
              image
            )
            VALUES (
              ${product.name},
              ${product.description},
              ${product.stock},
              ${product.costPrice || product.cost_price || 0},
              ${product.cashPrice || product.cash_price || 0},
              ${product.transferPrice || product.transfer_price || 0},
              ${product.image}
            )
          `;
          seededProducts += 1;
        }
      }

      await client.sql`COMMIT`;

      return NextResponse.json({
        message: 'Migración completada con éxito',
        seededUsers,
        seededProducts,
      });
    } catch (error) {
      await client.sql`ROLLBACK`;
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
