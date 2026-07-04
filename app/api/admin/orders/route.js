import { NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/jsonbin";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json({ orders: orders.reverse() });
}

export async function PATCH(req) {
  const { order_id, payment_status } = await req.json();
  const updated = await updateOrder(order_id, { payment_status });
  return NextResponse.json({ order: updated });
}
