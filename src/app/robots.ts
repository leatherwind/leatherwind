import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Robots policy. Everything public is crawlable; the API surface is not. */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
