import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";

/**
 * Responsive catalog grid.
 *
 * One column on phones keeps each photograph prominent; the grid widens to
 * four columns on large desktop. Consistent 4:5 framing in ProductCard keeps
 * every row aligned regardless of source image proportions.
 */
export function ProductGrid({
  products,
  className,
  priorityCount = 0,
  columns = "wide",
}: {
  products: Product[];
  className?: string;
  /** Number of leading cards that should load eagerly. */
  priorityCount?: number;
  columns?: "wide" | "compact";
}) {
  return (
    <ul
      role="list"
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2",
        columns === "wide" ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard
            product={product}
            priority={index < priorityCount}
            sizes={
              columns === "wide"
                ? "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            }
          />
        </li>
      ))}
    </ul>
  );
}
