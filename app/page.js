import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/jsonbin";

export const revalidate = 30; // ISR-ish refresh every 30s

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <section className="text-center py-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Digital Products, <span className="text-indigo-600">Instant Delivery</span>
          </h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            No account needed. Pick a product, check out as a guest, get your file.
          </p>
        </section>
        <div id="products">
          <ProductGrid initialProducts={products} />
        </div>
      </main>
    </>
  );
}
