import type { MetadataRoute } from "next";
import { ARTICLES } from "@/content/pages";
export const dynamic = "force-static";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about/", "/about/organization/", "/research/", "/programs/", "/news/", ...ARTICLES.map((a) => `/news/${a.slug}/`), "/privacy/"].map((p) => ({ url: base + p, changeFrequency: "weekly" }));
}
