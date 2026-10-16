import type { ProductSpecification, ProductVariation } from "@/types/product";

/**
 * Technical specification table.
 *
 * Rendered as a definition list so the label/value pairing is meaningful to
 * assistive technology. Only documented values appear — an empty list renders
 * nothing at all rather than a row of dashes.
 */
export function SpecificationList({
  specifications,
}: {
  specifications?: ProductSpecification[];
}) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <dl className="divide-y divide-sand border-y border-sand">
      {specifications.map((spec) => (
        <div
          key={`${spec.label}-${spec.value}`}
          className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-6"
        >
          <dt className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/55">
            {spec.label}
          </dt>
          <dd className="text-body-sm text-espresso sm:col-span-2">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Feature bullets exactly as printed in the catalog. */
export function FeatureList({ features }: { features?: string[] }) {
  if (!features || features.length === 0) return null;

  return (
    <ul role="list" className="lw-copy max-w-prose text-body text-charcoal/80">
      {features.map((feature) => (
        <li key={feature} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.7em] h-px w-4 shrink-0 bg-cognac"
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/** Documented materials, shown as a quiet list of attributes. */
export function MaterialsList({ materials }: { materials?: string[] }) {
  if (!materials || materials.length === 0) return null;

  return (
    <ul role="list" className="flex flex-wrap gap-2">
      {materials.map((material) => (
        <li
          key={material}
          className="border border-sand px-3 py-1.5 text-caption uppercase tracking-[0.1em] text-charcoal/70"
        >
          {material}
        </li>
      ))}
    </ul>
  );
}

/** Documented sizes, colours and other variations. */
export function VariationList({ variations }: { variations?: ProductVariation[] }) {
  if (!variations || variations.length === 0) return null;

  return (
    <dl className="space-y-4">
      {variations.map((variation) => (
        <div key={variation.label} className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-6">
          <dt className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/55">
            {variation.label}
          </dt>
          <dd className="text-body-sm text-espresso sm:col-span-2">
            {variation.options.join(" · ")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
