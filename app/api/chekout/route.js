import { NextResponse } from "next/server";
import { getProducts, addOrder, updateOrder, getOrders } from "@/lib/jsonbin";

// Mock Pakasir QRIS generation (replace with real API call in production)
async function createPakasirQRIS(order) {
  // Real usage:
  // const res = await fetch("https://app.pakasir.com/api/transactions", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     project: process.env.PAKASIR_SLUG,
  //     amount: order.total_amount,
  //     order_id: order.id,
  //     api_key: process.env.PAKASIR_API_KEY,
  //   }),
  // });
  // const data = await res.json();
  // return data.qris_url;

  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAKASIR-MOCK-${order.id}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { product_id, customer_name, customer_email, customer_whatsapp, payment_method } = body;

    if (!product_id || !customer_name || !customer_email || !customer_whatsapp || !payment_method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const products = await getProducts();
    const product = products.find((p) => p.id === product_id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const order = {
      id: `ord_${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      customer_name,
      customer_email,
      customer_whatsapp,
      total_amount: product.price,
      payment_method,
      payment_status: "PENDING",
      proof_of_payment_url: null,
      qris_url: null,
      created_at: new Date().toISOString(),
    };

    if (payment_method === "QRIS_PAKASIR") {
      order.qris_url = await createPakasirQRIS(order);
    }

    await addOrder(order);

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Used to attach manual-transfer proof after order creation
export async function PATCH(req) {
  try {
    const { order_id, proof_of_payment_url } = await req.json();
    if (!order_id || !proof_of_payment_url) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const updated = await updateOrder(order_id, { proof_of_payment_url });
    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Optional: order status lookup for "Track Order" page
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const orders = await getOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
