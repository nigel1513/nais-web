import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:4173/";
const PORT = 9223;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] });
const { lhr } = await lighthouse(url, { port: PORT, onlyCategories: ["performance", "accessibility", "seo"], formFactor: "mobile" });
await browser.close();
const s = (k) => Math.round(lhr.categories[k].score * 100);
const lcp = lhr.audits["largest-contentful-paint"].numericValue;
const cls = lhr.audits["cumulative-layout-shift"].numericValue;
console.log({ performance: s("performance"), accessibility: s("accessibility"), seo: s("seo"), lcpMs: Math.round(lcp), cls });
for (const k of ["accessibility", "seo"]) for (const ref of lhr.categories[k].auditRefs) { const a = lhr.audits[ref.id]; if (a.score !== null && a.score < 1 && ref.weight > 0) console.log(`  ${k} FAIL: ${a.id} — ${a.title}`); }
const ok = s("performance") >= 90 && s("accessibility") >= 95 && lcp < 2500 && cls < 0.1;
process.exit(ok ? 0 : 1);
