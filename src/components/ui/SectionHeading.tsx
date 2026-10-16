import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Rendered to the right on desktop, beneath on mobile. */
  action?: ReactNode;
  align?: "left" | "center";
  /** Use the light-on-dark treatment for espresso sections. */
  tone?: "default" | "inverse";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  tone = "default",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const inverse = tone === "inverse";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className={cn("lw-eyebrow mb-4", inverse && "text-cognac")}>{eyebrow}</p>
        ) : null}
        <Tag
          className={cn(
            "text-display-md",
            inverse && "text-ivory",
          )}
        >
          {title}
        </Tag>
        {description ? (
          <p
            className={cn(
              "mt-5 text-body-lg",
              inverse ? "text-ivory/70" : "text-charcoal/75",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className={cn("shrink-0", align === "center" && "mx-auto")}>{action}</div>
      ) : null}
    </div>
  );
}
