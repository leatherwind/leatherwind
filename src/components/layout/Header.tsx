"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/layout/Wordmark";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Sticky site header.
 *
 * The bar is transparent-to-solid: at the top of the page it sits flush on the
 * ivory background; once scrolled it gains a hairline and a soft backdrop so it
 * stays legible over photography without resorting to a heavy shadow.
 *
 * The mobile menu is a full-height panel with a proper focus/escape story.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the panel whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Add the scrolled treatment past a small threshold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes; body scroll is locked while the panel is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300 ease-editorial",
        scrolled
          ? "border-b border-sand bg-ivory/92 backdrop-blur-md"
          : "border-b border-transparent bg-ivory",
      )}
    >
      <div className="lw-container">
        <div className="flex h-[var(--lw-header-h)] items-center justify-between gap-6">
          <Wordmark size="md" />

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-caption font-medium uppercase tracking-[0.16em] transition-colors duration-300",
                      isActive(item.href)
                        ? "text-cognac"
                        : "text-charcoal/80 hover:text-espresso",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-cognac transition-transform duration-300 ease-editorial",
                        isActive(item.href) ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <WhatsAppButton size="sm" label="Inquire on WhatsApp" />
            </div>

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-sand text-espresso transition-colors hover:border-espresso lg:hidden"
            >
              {open ? (
                <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-navigation"
        hidden={!open}
        className="border-t border-sand bg-ivory lg:hidden"
      >
        <div className="lw-container py-6">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {siteConfig.nav.map((item) => (
                <li key={item.href} className="border-b border-sand/70 last:border-b-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between py-4 font-serif text-xl transition-colors",
                      isActive(item.href) ? "text-cognac" : "text-espresso hover:text-cognac",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6">
            <WhatsAppButton size="lg" className="w-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
