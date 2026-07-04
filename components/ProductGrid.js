"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";

export default function ProductGrid({ initialProducts }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const categories = useMemo(
    () => ["All", ...new Set(initialProducts.map((p) => p.category))],
    [initialProducts]
  );

  const filtered = initialProducts.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onBuy={() => setSelected(p)} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-neutral-500 py-10">
            No products match your search.
          </p>
        )}
      </div>

      {selected && (
        <CheckoutModal product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
