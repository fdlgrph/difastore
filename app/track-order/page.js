"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function TrackOrder() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const search = async () => {
    setError("");
    const res = await fetch(`/api/checkout?id=${id}`);
    if (!res.ok) return setError("Order not found");
    const { order } = await res.json();
    setOrder(order);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
        <div className="flex gap-2">
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID (e.g. ord_1720...)"
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent" />
          <button onClick={search} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Search</button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {order && (
          <div className="mt-6 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1 text-sm">
            <p><b>{order.product_name}</b></p>
            <p>Status: <b>{order.payment_status}</b></p>
            {order.payment_status === "SUCCESS" && (
              <a href={order.digital_content} className="text-indigo-600 underline">Download link</a>
            )}
          </div>
        )}
      </main>
    </>
  );
}
