import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onBuy }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow">
      <img src={product.image_url} alt={product.name} className="w-full h-44 object-cover" />
      <div className="p-4">
        <span className="text-xs font-medium text-indigo-600">{product.category}</span>
        <h3 className="font-semibold mt-1">{product.name}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold">Rp {product.price.toLocaleString("id-ID")}</span>
          <button
            onClick={onBuy}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg"
          >
            <ShoppingCart className="w-4 h-4" /> Buy
          </button>
        </div>
      </div>
    </div>
  );
}
