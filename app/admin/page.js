"use client";
import { useEffect, useState } from "react";
import { DollarSign, Clock, Package } from "lucide-react";
import ProductManager from "@/components/admin/ProductManager";
import TransactionManager from "@/components/admin/TransactionManager";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("transactions");

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then((d) => setOrders(d.orders));
  }, []);

  const revenue = orders.filter((o) => o.payment_status === "SUCCESS").reduce((s, o) => s + o.total_amount, 0);
  const pending = orders.filter((o) => o.payment_status === "PENDING").length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
      <h1 className="text-2xl font-bold mb-6">Difa Store — Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Metric icon={DollarSign} label="Total Revenue" value={`Rp ${revenue.toLocaleString("id-ID")}`} />
        <Metric icon={Clock} label="Pending Orders" value={pending} />
        <Metric icon={Package} label="Total Orders" value={orders.length} />
      </div>

      <div className="flex gap-2 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        {["transactions", "products"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-neutral-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "transactions" && <TransactionManager orders={orders} setOrders={setOrders} />}
      {tab === "products" && <ProductManager />}
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
