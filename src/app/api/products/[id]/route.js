import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { requireAdmin } from '@/lib/auth';
import { initDb } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    await initDb();

    const authError = await requireAdmin();

    if (authError) {
      return authError;
    }

    const { id } = await params;
    const updatedProduct = await request.json();
    const image = typeof updatedProduct.image === 'string' ? updatedProduct.image.trim() : '';

    const { rows } = await sql`
      UPDATE products 
      SET 
        name = ${updatedProduct.name},
        description = ${updatedProduct.description},
        stock = ${updatedProduct.stock},
        cost_price = ${updatedProduct.costPrice},
        cash_price = ${updatedProduct.cashPrice},
        transfer_price = ${updatedProduct.transferPrice},
        image = ${image}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = {
      ...rows[0],
      costPrice: Number(rows[0].cost_price),
      cashPrice: Number(rows[0].cash_price),
      transferPrice: Number(rows[0].transfer_price)
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product in database' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await initDb();

    const authError = await requireAdmin();

    if (authError) {
      return authError;
    }

    const { id } = await params;
    
    await sql`DELETE FROM products WHERE id = ${id}`;
    
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
