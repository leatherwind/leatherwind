import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Generated social share card.
 *
 * Rather than shipping a stock "share" photograph, the default Open Graph image
 * is a branded typographic card built from the design tokens. Per-product
 * pages override this with the product's own photograph.
 */

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#241914",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 120% at 12% 8%, rgba(166,107,69,0.28), transparent 55%)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#F7F3ED",
            fontFamily: "serif",
          }}
        >
          {siteConfig.wordmark}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 66,
              lineHeight: 1.08,
              color: "#F7F3ED",
              maxWidth: 900,
              fontFamily: "serif",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div style={{ display: "flex", height: 2, width: 160, backgroundColor: "#A66B45" }} />
          <div
            style={{
              fontSize: 24,
              color: "rgba(247,243,237,0.7)",
              maxWidth: 820,
            }}
          >
            A considered collection of leather goods.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
