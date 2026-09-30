import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about/", "/research/", "/programs/", "/news/", "/careers/", "/privacy/"].map((p) => ({ url: base + p, changeFrequency: "weekly" }));
}
