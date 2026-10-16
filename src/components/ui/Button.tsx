import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Button system.
 *
 * Three shapes of the same visual language, so an action never looks like a
 * different component just because it navigates instead of submitting:
 *   Button        — a real <button>
 *   LinkButton    — internal navigation (next/link)
 *   ExternalLink  — external navigation (opens in a new tab)
 */

export type ButtonVariant = "primary" | "dark" | "outline" | "light" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Cognac is the single accent and is reserved for the primary action.
  primary: "bg-cognac text-ivory hover:bg-cognac/90 active:bg-cognac",
  dark: "bg-espresso text-ivory hover:bg-leather active:bg-espresso",
  outline:
    "border border-espresso/25 text-espresso hover:border-espresso hover:bg-espresso hover:text-ivory",
  light: "bg-ivory text-espresso hover:bg-sand",
  ghost: "text-espresso hover:text-cognac",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[0.6875rem]",
  md: "px-5 py-2.5 text-xs",
  lg: "px-7 py-3.5 text-xs",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-control font-sans font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-55",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

interface CommonButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...rest
}: CommonButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonStyles({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonButtonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >) {
  return (
    <Link href={href} className={buttonStyles({ variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}

export function ExternalLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonButtonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles({ variant, size, className })}
      {...rest}
    >
      {children}
    </a>
  );
}
