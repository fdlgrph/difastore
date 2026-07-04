import { NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/jsonbin";

// Pakasir sends a POST callback on payment completion.
// Adjust field names to match Pakasir's actual payload schema.
export async function POST(req) {
  try {
    const signature = req.headers.get("x-pakasir-signature");
    if (process.env.PAKASIR_WEBHOOK_SECRET && signature !== process.env.PAKASIR_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await req.json();
    // Expected payload example: { order_id, status: "completed" | "failed", amount }
    const { order_id, status } = payload;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const orders = await getOrders();
    const order = orders.find((o) => o.id === order_id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const newStatus = status === "completed" ? "SUCCESS" : "FAILED";
    await updateOrder(order_id, { payment_status: newStatus });

    return NextResponse.json({ success: true, order_id, status: newStatus });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
