import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { requireAdmin } from '@/lib/auth';
import { initDb } from '@/lib/db';
import { hydrateProductsWithDriveImages } from '@/lib/googleDrive';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();

    const { rows } = await sql`SELECT * FROM products ORDER BY id ASC`;
    
    // Map database fields to frontend camelCase
    const products = rows.map(p => ({
      ...p,
      costPrice: Number(p.cost_price),
      cashPrice: Number(p.cash_price),
      transferPrice: Number(p.transfer_price)
    }));

    const hydratedProducts = await hydrateProductsWithDriveImages(products);
    
    return NextResponse.json(hydratedProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch products from database' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();

    const authError = await requireAdmin();

    if (authError) {
      return authError;
    }

    const newProduct = await request.json();
    const image = typeof newProduct.image === 'string' ? newProduct.image.trim() : '';
    
    const { rows } = await sql`
      INSERT INTO products (name, description, stock, cost_price, cash_price, transfer_price, image)
      VALUES (
        ${newProduct.name}, 
        ${newProduct.description}, 
        ${newProduct.stock}, 
        ${newProduct.costPrice}, 
        ${newProduct.cashPrice}, 
        ${newProduct.transferPrice}, 
        ${image}
      )
      RETURNING *;
    `;
    
    const product = {
      ...rows[0],
      costPrice: Number(rows[0].cost_price),
      cashPrice: Number(rows[0].cash_price),
      transferPrice: Number(rows[0].transfer_price)
    };
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add product to database' }, { status: 500 });
  }
}
