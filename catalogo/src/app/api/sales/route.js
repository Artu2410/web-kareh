import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { requireAdmin } from '@/lib/auth';
import { initDb } from '@/lib/db';
import { createSaleWithStockReservation } from '@/lib/sales';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();

    const authError = await requireAdmin();

    if (authError) {
      return authError;
    }

    const sales = await sql`
      SELECT * FROM sales 
      ORDER BY created_at DESC;
    `;
    return NextResponse.json(sales.rows);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();

    const authError = await requireAdmin();

    if (authError) {
      return authError;
    }

    const body = await request.json();
    const paymentMethod =
      body.payment_method === 'transferencia'
        ? 'transferencia'
        : body.payment_method === 'pendiente'
          ? 'pendiente'
          : 'efectivo';
    const priceMode =
      paymentMethod === 'transferencia' || paymentMethod === 'pendiente'
        ? 'transferencia'
        : 'efectivo';
    const saleResult = await createSaleWithStockReservation({
      customerName: body.customer_name,
      customerEmail: body.customer_email,
      customerPhone: body.customer_phone,
      items: body.items,
      paymentMethod,
      source: body.source === 'web' ? 'web' : 'local',
      notes: body.notes,
      priceMode,
    });

    if (saleResult.error) {
      return NextResponse.json(
        { error: saleResult.error },
        { status: saleResult.status }
      );
    }

    return NextResponse.json({
      ...saleResult.sale,
      items: saleResult.saleItems,
      totals: saleResult.totals,
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
