import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "outline" | "inverse";
  className?: string;
}) {
  const tones = {
    default: "bg-sand/70 text-espresso",
    outline: "border border-sand text-charcoal/75",
    inverse: "bg-espresso/85 text-ivory",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-control px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A hairline separator that reads as a tailored seam. */
export function Rule({ tone = "default", className }: { tone?: "default" | "inverse"; className?: string }) {
  return (
    <hr
      className={cn(
        "h-px w-full border-0",
        tone === "inverse" ? "bg-white/12" : "bg-sand",
        className,
      )}
    />
  );
}
