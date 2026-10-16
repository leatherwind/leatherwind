import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Restrained breadcrumb trail. The final crumb is the current page and is not
 * a link. Rendered as an ordered list inside <nav> for assistive technology.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-caption", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="uppercase tracking-[0.14em] text-charcoal/55 transition-colors hover:text-cognac"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="uppercase tracking-[0.14em] text-charcoal/80"
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-charcoal/30"
                  strokeWidth={1.5}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
