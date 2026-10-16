import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Typographic wordmark.
 *
 * The catalog carries an "LV" monogram, but no vector/scalable logo file has
 * been supplied, so this is a restrained type mark — not an invented logotype.
 * Swap the inner markup for an <Image> once the company provides the real logo.
 */
export function Wordmark({
  tone = "dark",
  size = "md",
  asLink = true,
  className,
}: {
  /** "dark" = espresso text for light surfaces; "light" = ivory text. */
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  className?: string;
}) {
  const sizes = {
    sm: "text-base tracking-[0.24em]",
    md: "text-lg tracking-[0.26em]",
    lg: "text-2xl tracking-[0.22em]",
  } as const;

  const content = (
    <span
      className={cn(
        "font-serif font-medium uppercase leading-none",
        sizes[size],
        tone === "light" ? "text-ivory" : "text-espresso",
        className,
      )}
    >
      {siteConfig.wordmark}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className="inline-flex items-center transition-opacity duration-300 hover:opacity-80"
    >
      {content}
    </Link>
  );
}
