import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { requireAdmin } from '@/lib/auth';
import { initDb } from '@/lib/db';
import { isAdminDebugApiEnabled, isProduction } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (isProduction() && !isAdminDebugApiEnabled()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await initDb();

    const authError = await requireAdmin();

    if (authError) {
      return authError;
    }

    const products = await sql`SELECT id, name, stock FROM products LIMIT 10`;
    const users = await sql`SELECT id, email, role FROM users LIMIT 10`;
    
    return NextResponse.json({ 
      products: products.rows, 
      users: users.rows 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
