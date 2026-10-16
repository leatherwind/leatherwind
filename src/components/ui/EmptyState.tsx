import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shown when a filter returns nothing, or when the catalog has not been
 * populated yet. Always explains what happened and offers a way forward.
 */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border border-dashed border-sand bg-white/60 px-6 py-16 text-center",
        className,
      )}
    >
      <h3 className="text-display-sm">{title}</h3>
      {description ? (
        <p className="mt-4 max-w-md text-body-sm text-charcoal/70">{description}</p>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
