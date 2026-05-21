import { sql } from "@vercel/postgres";
import { initDb } from "@/lib/db";

function buildError(error, status) {
  return { error, status };
}

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return buildError("Debes seleccionar al menos un producto.", 400);
  }

  const mergedItems = new Map();

  for (const rawItem of items) {
    const id = Number(rawItem?.id);
    const quantity = Number(rawItem?.quantity);

    if (!Number.isInteger(id) || id <= 0) {
      return buildError("Uno de los productos enviados no es valido.", 400);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return buildError("Cada producto debe tener una cantidad valida.", 400);
    }

    mergedItems.set(id, (mergedItems.get(id) || 0) + quantity);
  }

  return {
    items: [...mergedItems.entries()].map(([id, quantity]) => ({ id, quantity })),
  };
}

function toNumber(value) {
  return Number(value || 0);
}

function buildSaleItemSnapshot(product, quantity) {
  return {
    id: product.id,
    name: product.name,
    quantity,
    image: product.image || "",
    cashPrice: toNumber(product.cash_price),
    transferPrice: toNumber(product.transfer_price),
  };
}

function getItemUnitPrice(item, priceMode) {
  return priceMode === "transferencia" ? item.transferPrice : item.cashPrice;
}

function calculateTotal(items, priceMode) {
  return items.reduce(
    (total, item) => total + getItemUnitPrice(item, priceMode) * item.quantity,
    0
  );
}

function appendWebSaleTotals(notes, cashTotal, transferTotal) {
  const trimmedNotes = String(notes || "").trim();
  const summary = `Total efectivo: ${cashTotal} | Total transferencia: ${transferTotal}`;

  return trimmedNotes ? `${trimmedNotes}\n${summary}` : summary;
}

export async function createSaleWithStockReservation({
  customerName,
  customerEmail,
  customerPhone,
  items,
  paymentMethod,
  source,
  notes,
  priceMode,
}) {
  const normalizedCustomerName = String(customerName || "").trim();

  if (!normalizedCustomerName) {
    return buildError("Debes indicar el nombre del cliente.", 400);
  }

  const normalizedItems = normalizeItems(items);

  if (normalizedItems.error) {
    return normalizedItems;
  }

  await initDb();
  const client = await sql.connect();

  try {
    await client.sql`BEGIN`;

    const lockedProducts = [];

    for (const requestedItem of normalizedItems.items) {
      const { rows } = await client.sql`
        SELECT id, name, stock, image, cash_price, transfer_price
        FROM products
        WHERE id = ${requestedItem.id}
        FOR UPDATE
      `;

      const product = rows[0];

      if (!product) {
        await client.sql`ROLLBACK`;
        return buildError("Uno de los productos ya no existe.", 404);
      }

      if (product.stock < requestedItem.quantity) {
        await client.sql`ROLLBACK`;
        return buildError(
          `No hay stock suficiente para ${product.name}. Disponible: ${product.stock}.`,
          409
        );
      }

      lockedProducts.push({
        product,
        quantity: requestedItem.quantity,
      });
    }

    const saleItems = lockedProducts.map(({ product, quantity }) =>
      buildSaleItemSnapshot(product, quantity)
    );

    const resolvedPriceMode =
      priceMode || (paymentMethod === "transferencia" ? "transferencia" : "efectivo");
    const cashTotal = calculateTotal(saleItems, "efectivo");
    const transferTotal = calculateTotal(saleItems, "transferencia");
    const totalAmount = calculateTotal(saleItems, resolvedPriceMode);
    const normalizedNotes =
      source === "web"
        ? appendWebSaleTotals(notes, cashTotal, transferTotal)
        : String(notes || "").trim();

    const result = await client.sql`
      INSERT INTO sales (
        customer_name,
        customer_email,
        customer_phone,
        items,
        total_amount,
        payment_method,
        source,
        notes
      )
      VALUES (
        ${normalizedCustomerName},
        ${String(customerEmail || "").trim() || null},
        ${String(customerPhone || "").trim() || null},
        ${JSON.stringify(saleItems)},
        ${totalAmount},
        ${paymentMethod},
        ${source},
        ${normalizedNotes || null}
      )
      RETURNING *
    `;

    for (const { product, quantity } of lockedProducts) {
      await client.sql`
        UPDATE products
        SET stock = stock - ${quantity}
        WHERE id = ${product.id}
      `;
    }

    await client.sql`COMMIT`;

    return {
      sale: result.rows[0],
      saleItems,
      totals: {
        cash: cashTotal,
        transfer: transferTotal,
      },
    };
  } catch (error) {
    try {
      await client.sql`ROLLBACK`;
    } catch (rollbackError) {
      console.error("Sale rollback error:", rollbackError);
    }

    throw error;
  } finally {
    client.release();
  }
}
