"use client";
import { useEffect, useState } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";

const empty = { name: "", description: "", price: 0, category: "", image_url: "", digital_content: "" };

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = () => fetch("/api/admin/products").then((r) => r.json()).then((d) => setProducts(d.products));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, id: editingId } : form;
    await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setForm(empty);
    setEditingId(null);
    load();
  };

  const remove = async (id) => {
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const edit = (p) => {
    setForm(p);
    setEditingId(p.id);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form onSubmit={submit} className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3 h-fit">
        <h3 className="font-semibold">{editingId ? "Edit Product" : "New Product"}</h3>
        {["name", "category", "image_url", "digital_content"].map((f) => (
          <input key={f} placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm" />
        ))}
        <textarea placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm" />
        <input type="number" placeholder="price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm" />
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg text-sm">
          <Plus className="w-4 h-4" /> {editingId ? "Update" : "Add"} Product
        </button>
      </form>

      <div className="lg:col-span-2 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-neutral-500">Rp {p.price.toLocaleString("id-ID")} · {p.category}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(p)} className="p-2 rounded bg-neutral-100 dark:bg-neutral-800"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(p.id)} className="p-2 rounded bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
