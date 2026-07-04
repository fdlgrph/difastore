"use client";
import { Check, X } from "lucide-react";

export default function TransactionManager({ orders, setOrders }) {
  const decide = async (order_id, payment_status) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id, payment_status }),
    });
    if (res.ok) {
      const { order } = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead className="text-left text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th className="p-3">Order</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Method</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-neutral-100 dark:border-neutral-800">
              <td className="p-3">{o.id}<br /><span className="text-xs text-neutral-400">{o.product_name}</span></td>
              <td className="p-3">{o.customer_name}<br /><span className="text-xs text-neutral-400">{o.customer_whatsapp}</span></td>
              <td className="p-3">Rp {o.total_amount.toLocaleString("id-ID")}</td>
              <td className="p-3">{o.payment_method}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  o.payment_status === "SUCCESS" ? "bg-green-100 text-green-700" :
                  o.payment_status === "FAILED" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>{o.payment_status}</span>
              </td>
              <td className="p-3">
                {o.payment_method === "MANUAL" && o.payment_status === "PENDING" && (
                  <div className="flex gap-2">
                    {o.proof_of_payment_url && (
                      <span className="text-xs text-neutral-400">{o.proof_of_payment_url}</span>
                    )}
                    <button onClick={() => decide(o.id, "SUCCESS")} className="p-1.5 rounded bg-green-100 text-green-700"><Check className="w-4 h-4" /></button>
                    <button onClick={() => decide(o.id, "FAILED")} className="p-1.5 rounded bg-red-100 text-red-700"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
