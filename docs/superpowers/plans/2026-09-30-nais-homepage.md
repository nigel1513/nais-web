# NAIS 홈페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하나의 파티클 시스템이 스크롤에 따라 7개 형태로 변형되는 NAIS 홈페이지(홈 + 준비 중 하위 페이지)를 Next.js 정적 사이트로 만들어 개인 서버 Nginx에 배포 가능한 상태로 완성한다.

**Architecture:** 모든 콘텐츠는 시맨틱 HTML 섹션으로 먼저 렌더링되고, 3D 캔버스는 첫 렌더 이후 클라이언트에서만 로드되는 점진적 향상 레이어다. 형태별 입자 좌표는 순수 함수(`lib/particles/targets/*`)로 미리 계산해 BufferAttribute로 보관하고, 셰이더가 `mix(aFrom, aTo, progress)`로 보간한다. 스크롤 위치 → `{from, to, t}` 변환은 순수 함수(`resolveState`)가 담당하고 결과를 zustand vanilla store에 써서 R3F `useFrame`이 읽는다.

**Tech Stack:** Next.js 16.3 (App Router, `output: 'export'`), React 19.3, TypeScript 5.9, Tailwind CSS 4.3, three 0.186, @react-three/fiber 9.8, gsap 3.15 + @gsap/react 2.1, zustand 5, Vitest 5, Playwright 1.63, Pretendard 1.3.9

**Spec:** `docs/superpowers/specs/2026-09-30-nais-homepage-design.md` (기반 문서 `NAIS_homepage_concept_brief.md`는 저장소 밖 `/data/project/nst/`에 있음)

**일정(5일):** Day1 Task 1–3 · Day2 Task 4–5 · Day3 Task 6–7 · Day4 Task 8–9 · Day5 Task 10–11

## Global Constraints

- 범위는 프론트엔드만. Ask NAIS, RAG, AI Agent, AI Chat 구현 금지.
- 비공식 표기(`Unofficial Concept Project` 등) 넣지 않는다. 공식 로고 이미지·정부 상징 사용 금지, 직접 만든 `NAIS` 텍스트 워드마크만 사용.
- NST 표기는 Hero eyebrow 소속 한 줄(선택)과 Footer `국가과학기술연구회 국가과학AI연구센터` 두 곳으로 제한.
- Hero H1은 **AI로 과학을, 과학으로 미래를**. 서브카피: AI로 과학의 발견 방식을 바꿉니다. 과학기술 분야의 AI 활용을 촉진하고 연구기관을 연결하는 AI for Science 허브.
- 한국어 주 언어. 영어는 eyebrow·라벨·섹션 번호에만.
- 홈에서 "공식 4대 추진과제"라고 단정하지 않고 `What We Do`로 표기.
- K-문샷 12개 미션 명칭은 `Mission 01`~`Mission 12` placeholder. 확인되지 않은 명칭·수치·미션을 임의 생성하지 않는다.
- 단일 다크 테마(`color-scheme: dark`). 색: 배경 Deep Navy/Near Black, Primary Cyan/Teal, Secondary Cool Blue. NVIDIA 초록·FutureHouse 색·무지개/네온/보라-파랑 그라디언트 금지. DNA·단백질·뇌·로봇·회로기판 이미지 금지.
- 파티클은 `THREE.Points` 하나만 유지. 상태 순서 `0 sphere → 1 mesh → 2 convergence → 3 loop → 4 moonshot → 5 korea → 6 sphereFinal`.
- 입자 수 Desktop 40k / Tablet 20k / Mobile 8k.
- 텍스트 대비 4.5:1 이상(scrim 사용). WebGL 없이도 모든 콘텐츠가 HTML로 읽혀야 한다.
- 목표: Lighthouse(모바일) Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5s, CLS < 0.1.
- 커밋 메시지 끝에 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- WebGL을 쓸 수 없는 브라우저(구형 기기, GPU 차단): 캔버스 없이 모든 섹션 제목·본문이 보이고 콘솔 에러가 없어야 한다 → Task 9 e2e `webgl-off`.
- 앵커 점프·빠른 스크롤(`/#moonshot` 직접 진입, 헤더 링크 클릭): 중간 상태를 모두 거치지 않고 해당 섹션 상태로 바로 수렴해야 한다 → Task 5 단위 테스트 `jump`, Task 9 e2e `deep-link`.
- 창 크기 변경·기기 회전(1440 → 390): 가로 스크롤이 생기지 않고 섹션 경계가 다시 계산되어야 한다 → Task 9 e2e `resize`.
- `prefers-reduced-motion: reduce`: 형태 전환 애니메이션과 회전 없이 섹션별 정지 형태만 보여야 한다 → Task 5 단위 테스트 `snapForReducedMotion`, Task 9 e2e `reduced-motion`.
- 저사양·좁은 화면(모바일, 코어 4개 이하): 입자 수를 줄여 프레임 저하를 막아야 한다 → Task 6 단위 테스트 `particleCount`.

---

## File Structure

```text
nais-web/
├─ next.config.ts                     정적 export 설정
├─ vitest.config.ts                   단위 테스트(node 환경)
├─ playwright.config.ts               e2e (out/ 정적 서빙)
├─ scripts/build-korea-outline.mjs    Natural Earth → korea-outline.json 생성(1회)
├─ deploy/nginx.conf                  배포용 Nginx 서버 블록
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                   폰트·메타데이터·Header/Footer
│  │  ├─ globals.css                  Tailwind v4 @theme 토큰
│  │  ├─ page.tsx                     홈(섹션 조립 + ParticleLayer)
│  │  ├─ not-found.tsx
│  │  ├─ sitemap.ts / robots.ts
│  │  └─ (sub)/{about,research,programs,news,careers}/page.tsx  준비 중 페이지
│  ├─ fonts/PretendardVariable.woff2
│  ├─ content/
│  │  ├─ site.ts                      기관명·미션·슬로건·내비·푸터(출처 주석)
│  │  ├─ home.ts                      섹션별 카피·카드·뉴스
│  │  ├─ institutes.ts                기관 좌표(도시 수준 근사, 출처 주석)
│  │  └─ korea-outline.json           한반도 윤곽 링(lon,lat)
│  ├─ lib/
│  │  ├─ particles/
│  │  │  ├─ rng.ts                    mulberry32
│  │  │  ├─ states.ts                 상태 이름·설정(spin/tilt/offset/lines)
│  │  │  ├─ transform.ts              셰이더와 동일한 rotY/tiltX (라벨 투영용)
│  │  │  ├─ targets/{sphere,mesh,convergence,loop,moonshot,korea,index}.ts
│  │  │  ├─ geo.ts                    투영·point-in-polygon·둘레 샘플링
│  │  │  ├─ lines.ts                  최근접 이웃 연결선
│  │  │  ├─ labels.ts                 상태별 라벨 앵커
│  │  │  └─ count.ts                  기기별 입자 수
│  │  └─ scroll/
│  │     ├─ resolve.ts                scrollY → {from,to,t}, reduced-motion 스냅
│  │     ├─ store.ts                  zustand vanilla store
│  │     └─ useSectionScroll.ts       섹션 경계 측정 + 스크롤 구독
│  └─ components/
│     ├─ layout/{Header,Footer,Wordmark}.tsx
│     ├─ home/{Section,Hero,Platform,Convergence,Autonomous,Moonshot,Ecosystem,News}.tsx
│     └─ three/
│        ├─ ParticleLayer.tsx         dynamic import(ssr:false) + WebGL 감지
│        ├─ ParticleScene.tsx         Canvas
│        ├─ ParticleSystem.tsx        Points + 속성 교체
│        ├─ ParticleLines.tsx         LineSegments
│        ├─ ProjectedLabels.tsx       3D 앵커 → HTML 라벨
│        └─ shaders.ts
└─ tests/
   ├─ unit/*.test.ts
   └─ e2e/*.spec.ts
```

---

### Task 1: 프로젝트 스캐폴드와 테스트 도구

**Files:**
- Create: Next.js 스캐폴드 전체, `next.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `package.json`(scripts), `.gitignore`

**Interfaces:**
- Produces: `npm run build` → `out/` 정적 산출물. `npm test`(vitest), `npm run test:e2e`(build + playwright). 경로 별칭 `@/*` → `src/*`.

- [ ] **Step 1: 임시 디렉터리에 스캐폴드 생성 후 복사** (저장소에 README·docs가 있어 create-next-app을 직접 실행할 수 없음)

```bash
cd /data/project/nst/nais-web
TMP=$(mktemp -d)
npx --yes create-next-app@16.3.7 "$TMP/app" --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --yes
rsync -a --exclude .git --exclude README.md --exclude .gitignore "$TMP/app/" ./
cat "$TMP/app/.gitignore" >> .gitignore && sort -u -o .gitignore .gitignore
npm install typescript@5.9.3 --save-dev --save-exact
```

- [ ] **Step 2: 런타임·테스트 의존성 설치**

```bash
npm install three@0.186.1 @react-three/fiber@9.8.1 gsap@3.15.0 @gsap/react@2.1.2 zustand@5.0.15
npm install -D @types/three@0.186.0 vitest@5.0.2 @playwright/test@1.63.0 serve pretendard@1.3.9
```

- [ ] **Step 3: 정적 export 설정** — `next.config.ts` 전체 교체

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 4: Vitest 설정** — `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { environment: "node", include: ["tests/unit/**/*.test.ts"] },
});
```

- [ ] **Step 5: Playwright 설정** — `playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: { baseURL: "http://localhost:4173" },
  webServer: { command: "npx serve out -l 4173 --no-clipboard", port: 4173, reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
```

- [ ] **Step 6: package.json scripts** — `scripts`에 추가/수정

```json
{
  "dev": "next dev",
  "build": "next build",
  "lint": "eslint",
  "test": "vitest run",
  "test:e2e": "next build && playwright test",
  "korea-outline": "node scripts/build-korea-outline.mjs"
}
```

- [ ] **Step 7: 스모크 테스트 작성**

`tests/unit/smoke.test.ts`
```ts
import { expect, test } from "vitest";
test("vitest runs", () => expect(1 + 1).toBe(2));
```

`tests/e2e/smoke.spec.ts`
```ts
import { expect, test } from "@playwright/test";
test("home responds", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
});
```

- [ ] **Step 8: 실행 확인**

Run: `npm test && npm run test:e2e`
Expected: vitest 1 passed, playwright 2 passed (desktop, mobile). `out/index.html` 존재.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: Next.js 정적 export 스캐폴드와 Vitest·Playwright 설정

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: 디자인 토큰·폰트·레이아웃(Header/Footer/Wordmark)

**Files:**
- Create: `src/fonts/PretendardVariable.woff2`, `src/content/site.ts`, `src/components/layout/{Wordmark,Header,Footer}.tsx`, `tests/e2e/layout.spec.ts`
- Modify: `src/app/globals.css`(전체 교체), `src/app/layout.tsx`(전체 교체), `src/app/page.tsx`(임시 최소 홈)

**Interfaces:**
- Produces: `SITE` 객체(`src/content/site.ts`), CSS 토큰(`--color-ink-950`, `--color-ink-900`, `--color-line`, `--color-fg`, `--color-muted`, `--color-cyan`, `--color-blue`), 폰트 변수 `--font-pretendard`, `--font-plex-mono`. 레이아웃은 `<main id="main">` 안에 페이지를 렌더.

- [ ] **Step 1: 실패하는 e2e 작성** — `tests/e2e/layout.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("skip link moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "본문 바로가기" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("footer states affiliation once and no unofficial label", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("국가과학기술연구회 국가과학AI연구센터");
  await expect(page.locator("body")).not.toContainText(/unofficial/i);
});

test("header navigation lists five sections", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "주 메뉴" });
  for (const name of ["About", "Research", "Programs", "News", "Careers"]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm run test:e2e -- tests/e2e/layout.spec.ts --project=desktop`
Expected: FAIL (skip link 없음)

- [ ] **Step 3: 폰트 파일 복사**

```bash
mkdir -p src/fonts && cp node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2 src/fonts/
```

- [ ] **Step 4: 사이트 콘텐츠** — `src/content/site.ts`

```ts
// 출처: nais.re.kr 메타 태그(미션·슬로건·비전), 과기정통부 보도설명 2026-07-10(출범 시점)
export const SITE = {
  shortName: "NAIS",
  nameKo: "국가과학AI연구센터",
  nameEn: "National AI for Science Research Center",
  affiliation: "국가과학기술연구회 국가과학AI연구센터",
  slogan: "AI로 과학을, 과학으로 미래를",
  mission: "과학기술분야 정부출연연구기관의 AI 전환을 견인합니다",
  vision: "모든 연구자가 하나의 연구소가 되는 과학 AI 시대",
  description:
    "국가과학AI연구센터(NAIS)는 과학기술 분야의 AI 활용을 촉진하고 연구기관을 연결하는 AI for Science 허브입니다.",
  nav: [
    { label: "About", href: "/about/" },
    { label: "Research", href: "/research/" },
    { label: "Programs", href: "/programs/" },
    { label: "News", href: "/news/" },
    { label: "Careers", href: "/careers/" },
  ],
  footerLinks: [
    { label: "Contact", href: "/about/" },
    { label: "Privacy", href: "/about/" },
    { label: "Accessibility", href: "/about/" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
} as const;
```

- [ ] **Step 5: 토큰** — `src/app/globals.css` 전체 교체

```css
@import "tailwindcss";

@theme {
  --color-ink-950: #05080d;
  --color-ink-900: #0a1019;
  --color-ink-800: #111a26;
  --color-line: #1e2a3a;
  --color-fg: #e8eef5;
  --color-muted: #9aa9bc;
  --color-cyan: #3fd0d4;
  --color-blue: #4a8dff;
  --font-sans: var(--font-pretendard), "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
}

html {
  color-scheme: dark;
  background: var(--color-ink-950);
  color: var(--color-fg);
  -webkit-font-smoothing: antialiased;
}
body { font-family: var(--font-sans); overflow-x: hidden; }
h1, h2, h3 { text-wrap: balance; word-break: keep-all; }
p { word-break: keep-all; }
:focus-visible { outline: 2px solid var(--color-cyan); outline-offset: 3px; }
.eyebrow { font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-cyan); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 6: 워드마크** — `src/components/layout/Wordmark.tsx`

```tsx
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="9.5" fill="none" stroke="var(--color-cyan)" strokeWidth="1.2" />
        <circle cx="11" cy="11" r="2.4" fill="var(--color-cyan)" />
        <circle cx="4.5" cy="7" r="1.3" fill="var(--color-blue)" />
        <circle cx="17" cy="15.5" r="1.3" fill="var(--color-blue)" />
        <path d="M4.5 7 L11 11 L17 15.5" stroke="var(--color-cyan)" strokeWidth="0.8" opacity="0.7" />
      </svg>
      <span className="font-mono text-[15px] font-medium tracking-[0.18em]">NAIS</span>
    </span>
  );
}
```

- [ ] **Step 7: Header** — `src/components/layout/Header.tsx`

```tsx
import Link from "next/link";
import { SITE } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink-950/70 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink-800 focus:px-3 focus:py-2">
        본문 바로가기
      </a>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" aria-label={`${SITE.shortName} ${SITE.nameKo} 홈`}><Wordmark /></Link>
        <nav aria-label="주 메뉴">
          <ul className="flex gap-4 text-sm text-muted md:gap-7">
            {SITE.nav.map((item) => (
              <li key={item.href} className={item.label === "About" || item.label === "Careers" ? "" : "hidden sm:block"}>
                <Link className="hover:text-fg" href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

> 모바일(< 640px)에서는 About·Careers만 보인다. e2e "five sections" 테스트는 desktop 프로젝트에서만 실행되도록 Step 1 테스트 상단에 `test.skip(({ isMobile }) => isMobile, "모바일은 축약 메뉴");`를 해당 테스트 안 첫 줄로 추가한다.

- [ ] **Step 8: Footer** — `src/components/layout/Footer.tsx`

```tsx
import Link from "next/link";
import { SITE } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-line bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div className="space-y-3">
          <Wordmark />
          <p className="text-sm text-muted">{SITE.nameEn}</p>
          <p className="text-sm text-muted">{SITE.affiliation}</p>
        </div>
        <ul className="space-y-2 text-sm">
          {SITE.nav.map((l) => (<li key={l.href}><Link className="text-muted hover:text-fg" href={l.href}>{l.label}</Link></li>))}
        </ul>
        <ul className="space-y-2 text-sm">
          {SITE.footerLinks.map((l) => (<li key={l.label}><Link className="text-muted hover:text-fg" href={l.href}>{l.label}</Link></li>))}
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 9: 루트 레이아웃** — `src/app/layout.tsx` 전체 교체

```tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/content/site";
import "./globals.css";

const pretendard = localFont({ src: "../fonts/PretendardVariable.woff2", variable: "--font-pretendard", weight: "100 900", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${SITE.shortName} ${SITE.nameKo}`, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  openGraph: { title: `${SITE.shortName} ${SITE.nameKo}`, description: SITE.slogan, type: "website", locale: "ko_KR" },
};

export const viewport: Viewport = { themeColor: "#05080d", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${plexMono.variable}`}>
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 10: 임시 홈** — `src/app/page.tsx` 전체 교체

```tsx
import { SITE } from "@/content/site";
export default function Home() {
  return <h1 className="px-8 pt-32 text-4xl font-bold">{SITE.slogan}</h1>;
}
```

- [ ] **Step 11: 통과 확인**

Run: `npm run test:e2e -- tests/e2e/layout.spec.ts`
Expected: PASS (desktop 3, mobile 2 + 1 skipped)

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: 디자인 토큰, 폰트, 워드마크, Header/Footer 레이아웃

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: 홈 콘텐츠 데이터·기관 좌표·한반도 윤곽

**Files:**
- Create: `src/content/home.ts`, `src/content/institutes.ts`, `scripts/build-korea-outline.mjs`, `src/content/korea-outline.json`, `tests/unit/content.test.ts`

**Interfaces:**
- Produces:
  - `HOME_SECTIONS: readonly { id: string; eyebrow: string; title: string }[]` — 길이 7, 순서가 파티클 상태 순서와 같다. id: `hero, platform, convergence, autonomous, moonshot, ecosystem, news`.
  - `PLATFORM_CARDS`, `CONVERGENCE_CARDS`, `AUTONOMOUS_POINTS`, `MISSIONS`, `NEWS: { date: string; title: string; detail: string; href?: string }[]` (날짜 내림차순)
  - `INSTITUTES: { code: string; nameKo: string; city: string; lon: number; lat: number }[]`
  - `korea-outline.json`: `number[][][]` (링 배열, 각 점 `[lon, lat]`)

- [ ] **Step 1: 실패하는 테스트** — `tests/unit/content.test.ts`

```ts
import { describe, expect, test } from "vitest";
import { HOME_SECTIONS, NEWS, MISSIONS, PLATFORM_CARDS } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import outline from "@/content/korea-outline.json";

describe("home content", () => {
  test("seven sections in particle-state order", () => {
    expect(HOME_SECTIONS.map((s) => s.id)).toEqual(["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"]);
  });
  test("news sorted by date descending with ISO dates", () => {
    const dates = NEWS.map((n) => n.date);
    dates.forEach((d) => expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/));
    expect([...dates].sort().reverse()).toEqual(dates);
  });
  test("missions are placeholders only", () => {
    expect(MISSIONS).toHaveLength(12);
    MISSIONS.forEach((m, i) => expect(m).toBe(`Mission ${String(i + 1).padStart(2, "0")}`));
  });
  test("platform has five cards", () => expect(PLATFORM_CARDS).toHaveLength(5));
});

describe("geo data", () => {
  test("institutes inside South Korea bounds", () => {
    expect(INSTITUTES.length).toBeGreaterThanOrEqual(20);
    INSTITUTES.forEach((i) => {
      expect(i.lon).toBeGreaterThan(124.5); expect(i.lon).toBeLessThan(130);
      expect(i.lat).toBeGreaterThan(33); expect(i.lat).toBeLessThan(38.7);
    });
  });
  test("korea outline rings are within peninsula bbox", () => {
    const rings = outline as number[][][];
    expect(rings.length).toBeGreaterThan(0);
    rings.flat().forEach(([lon, lat]) => {
      expect(lon).toBeGreaterThan(124); expect(lon).toBeLessThan(131.5);
      expect(lat).toBeGreaterThan(33); expect(lat).toBeLessThan(43.1);
    });
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: FAIL (모듈 없음)

- [ ] **Step 3: 한반도 윤곽 생성 스크립트** — `scripts/build-korea-outline.mjs`

```js
// Natural Earth 1:50m Admin 0 (퍼블릭 도메인)에서 한국(KOR)·북한(PRK) 외곽선만 추출한다.
import { writeFile } from "node:fs/promises";

const URL_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";
const MIN_POINTS = 12; // 작은 섬은 제외

const geo = await (await fetch(URL_NE)).json();
const rings = [];
for (const f of geo.features) {
  if (!["KOR", "PRK"].includes(f.properties.ADM0_A3)) continue;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    const outer = poly[0];
    if (outer.length >= MIN_POINTS) rings.push(outer.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]));
  }
}
await writeFile(new URL("../src/content/korea-outline.json", import.meta.url), JSON.stringify(rings));
console.log(`rings: ${rings.length}, points: ${rings.flat().length}`);
```

Run: `npm run korea-outline`
Expected: `rings: N, points: M` 출력(N ≥ 2), `src/content/korea-outline.json` 생성.

- [ ] **Step 4: 기관 좌표** — `src/content/institutes.ts`

```ts
// 과학기술분야 정부출연연구기관 소재지. 좌표는 각 기관 공식 주소 기준 도시 수준 근사값(시각화용, ±1km).
// 배포 전 기관 홈페이지 주소로 재확인할 것.
export interface Institute { code: string; nameKo: string; city: string; lon: number; lat: number }

export const INSTITUTES: Institute[] = [
  { code: "KIST", nameKo: "한국과학기술연구원", city: "서울", lon: 127.0466, lat: 37.6036 },
  { code: "KBSI", nameKo: "한국기초과학지원연구원", city: "대전", lon: 127.3625, lat: 36.3724 },
  { code: "NIMS", nameKo: "국가수리과학연구소", city: "대전", lon: 127.356, lat: 36.374 },
  { code: "KASI", nameKo: "한국천문연구원", city: "대전", lon: 127.3614, lat: 36.3736 },
  { code: "KRIBB", nameKo: "한국생명공학연구원", city: "대전", lon: 127.3587, lat: 36.3735 },
  { code: "KISTI", nameKo: "한국과학기술정보연구원", city: "대전", lon: 127.3603, lat: 36.3913 },
  { code: "KIOM", nameKo: "한국한의학연구원", city: "대전", lon: 127.354, lat: 36.3925 },
  { code: "KITECH", nameKo: "한국생산기술연구원", city: "천안", lon: 127.152, lat: 36.8453 },
  { code: "ETRI", nameKo: "한국전자통신연구원", city: "대전", lon: 127.3664, lat: 36.3826 },
  { code: "NSR", nameKo: "국가보안기술연구소", city: "대전", lon: 127.37, lat: 36.39 },
  { code: "KICT", nameKo: "한국건설기술연구원", city: "고양", lon: 126.765, lat: 37.6697 },
  { code: "KRRI", nameKo: "한국철도기술연구원", city: "의왕", lon: 126.9536, lat: 37.3916 },
  { code: "KRISS", nameKo: "한국표준과학연구원", city: "대전", lon: 127.3717, lat: 36.3886 },
  { code: "KFRI", nameKo: "한국식품연구원", city: "완주", lon: 127.05, lat: 35.84 },
  { code: "WiKim", nameKo: "세계김치연구소", city: "광주", lon: 126.84, lat: 35.18 },
  { code: "KIGAM", nameKo: "한국지질자원연구원", city: "대전", lon: 127.357, lat: 36.3749 },
  { code: "KIMM", nameKo: "한국기계연구원", city: "대전", lon: 127.3571, lat: 36.3918 },
  { code: "KIMS", nameKo: "한국재료연구원", city: "창원", lon: 128.676, lat: 35.192 },
  { code: "KARI", nameKo: "한국항공우주연구원", city: "대전", lon: 127.3565, lat: 36.3735 },
  { code: "KIER", nameKo: "한국에너지기술연구원", city: "대전", lon: 127.357, lat: 36.38 },
  { code: "KERI", nameKo: "한국전기연구원", city: "창원", lon: 128.717, lat: 35.19 },
  { code: "KRICT", nameKo: "한국화학연구원", city: "대전", lon: 127.36, lat: 36.3755 },
  { code: "KIT", nameKo: "안전성평가연구소", city: "대전", lon: 127.349, lat: 36.3895 },
  { code: "KAERI", nameKo: "한국원자력연구원", city: "대전", lon: 127.371, lat: 36.426 },
  { code: "KFE", nameKo: "한국핵융합에너지연구원", city: "대전", lon: 127.366, lat: 36.366 },
];
```

- [ ] **Step 5: 홈 콘텐츠** — `src/content/home.ts`

```ts
// 출처: reports/NAIS 국가과학AI연구센터 조사.md. [계획] 항목은 status: "planned"로 표시한다.
export const HOME_SECTIONS = [
  { id: "hero", eyebrow: "National AI for Science Research Center", title: "AI로 과학을, 과학으로 미래를" },
  { id: "platform", eyebrow: "01 · AI Platform", title: "과학 AI를 위한 하나의 공통 기반" },
  { id: "convergence", eyebrow: "02 · AI Convergence", title: "AI와 과학 도메인을 연결합니다" },
  { id: "autonomous", eyebrow: "03 · Autonomous Science", title: "AI가 연구를 돕는 것을 넘어, 연구 과정 자체에 참여합니다" },
  { id: "moonshot", eyebrow: "04 · K-Moonshot", title: "대한민국이 풀어야 할 과학기술 난제에 AI로 도전합니다" },
  { id: "ecosystem", eyebrow: "05 · Research Ecosystem", title: "대한민국의 연구 역량을 하나의 AI 생태계로 연결합니다" },
  { id: "news", eyebrow: "News & Careers", title: "Build the future of science with AI." },
] as const;

export const HERO_SUB = "AI로 과학의 발견 방식을 바꿉니다. 과학기술 분야의 AI 활용을 촉진하고 연구기관을 연결하는 AI for Science 허브.";

export interface Card { label: string; title: string; body: string; status?: "planned" }

export const PLATFORM_CARDS: Card[] = [
  { label: "AI-OS", title: "과학AI 통합플랫폼", body: "연구자가 모델·데이터·도구를 한곳에서 쓰는 과학 AI 운영 환경입니다.", status: "planned" },
  { label: "GPU", title: "연구용 컴퓨팅 자원", body: "출연연 연구과제에 GPU 자원을 배정해 대규모 AI 연구를 지원합니다." },
  { label: "MODEL", title: "공용 LLM", body: "연구 현장에서 함께 쓰는 공용 언어모델을 제공합니다." },
  { label: "DATA", title: "AI-ready 연구데이터", body: "흩어진 연구데이터를 AI가 학습·활용할 수 있는 형태로 정리합니다.", status: "planned" },
  { label: "API", title: "개방형 API", body: "공용 모델과 도구를 연구 시스템에서 바로 호출할 수 있게 연결합니다." },
];

export const CONVERGENCE_CARDS: Card[] = [
  { label: "SEED", title: "AI 융합연구사업 Seed형", body: "과제당 최대 2억 원, 약 15개 과제를 선정해 GPU와 공용 LLM·API를 함께 지원합니다." },
  { label: "AX", title: "연구 AX", body: "연구와 행정 현장의 반복 업무를 AI로 전환하는 방법을 함께 설계합니다." },
  { label: "PILOT", title: "융합 실증", body: "우수 Seed 과제를 실증 단계로 확장해 현장 적용 가능성을 검증합니다." },
  { label: "ASSET", title: "AI-ready 연구자산", body: "데이터·프로토콜·에이전트를 다른 기관이 재사용할 수 있는 자산으로 만듭니다." },
];

export const LOOP_STAGES = ["질문", "탐색", "가설", "실험", "분석", "학습"] as const;

export const AUTONOMOUS_POINTS: Card[] = [
  { label: "UNIT", title: "자율형과학시스템연구단", body: "AI가 가설을 세우고 실험을 설계·분석하는 자율형 과학 시스템을 연구합니다." },
  { label: "PLATFORM", title: "AI 과학자 플랫폼", body: "연구자가 AI 과학자와 함께 연구하는 플랫폼을 베타로 준비합니다.", status: "planned" },
  { label: "LAB", title: "자율실험실 컨소시엄", body: "한국기초과학지원연구원과 함께 자율실험실 컨소시엄 공동 사무국을 맡습니다." },
];

export const MOONSHOT_BODY =
  "과학기술×AI 국가전략(K-문샷)은 2035년까지 12개 미션에 도전합니다. NAIS는 이 전략의 자원 통합 플랫폼이자 협업 허브입니다.";

export const MISSIONS = Array.from({ length: 12 }, (_, i) => `Mission ${String(i + 1).padStart(2, "0")}`);

export const ECOSYSTEM_BODY = "출연연의 도메인 전문성부터 대학·산업계의 AI 역량까지.";

export const NEWS = [
  { date: "2026-09-30", title: "NAIS AI 해커톤 본선", detail: "R&D 특화 AI 에이전트 · 성과 작성·연구행정 트랙 포함" },
  { date: "2026-09-29", title: "2026 NAIS AI 융합연구사업 Seed형 공모", detail: "접수 10월 20일까지 · 과제당 최대 2억 원" },
  { date: "2026-09-23", title: "2026년도 NAIS 제3차 정규직 채용 공고", detail: "연구직·연구기술직 29명 · 접수 10월 12일 14:00까지", href: "/careers/" },
];
```

- [ ] **Step 6: 통과 확인**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: PASS (6 tests). `resolveJsonModule`은 create-next-app 기본 tsconfig에 켜져 있다. 꺼져 있으면 `tsconfig.json`의 `compilerOptions`에 `"resolveJsonModule": true`를 추가한다.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: 홈 콘텐츠, 기관 좌표, 한반도 윤곽 데이터

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: 파티클 기반 모듈과 형태 1차(sphere·mesh·loop) + 상태 변환

**Files:**
- Create: `src/lib/particles/{rng,states,transform}.ts`, `src/lib/particles/targets/{sphere,mesh,loop}.ts`, `tests/unit/particles-core.test.ts`

**Interfaces:**
- Produces:
  - `mulberry32(seed: number): () => number` (0 ≤ x < 1)
  - `STATES = ["sphere","mesh","convergence","loop","moonshot","korea","sphereFinal"] as const`, `type StateName`
  - `STATE_CONFIG: Record<StateName, { spin: number; tilt: number; offsetX: number; brightness: number; lines: { k: number; maxDist: number; anchors: number } | null }>`
  - `applyStateTransform(p: [number,number,number], spin: number, tilt: number, time: number): [number,number,number]` — 셰이더 `xf()`와 동일 수식
  - `sphere(count: number, seed?: number): Float32Array`, `mesh(count, seed?)`, `loop(count, seed?)` — 길이 `count*3`, 모든 값 `|v| ≤ 3`
  - `MESH_LABEL_ANCHORS: { text: string; p: [number,number,number] }[]` (5개), `LOOP_STATIONS: [number,number,number][]` (6개)

- [ ] **Step 1: 실패하는 테스트** — `tests/unit/particles-core.test.ts`

```ts
import { describe, expect, test } from "vitest";
import { mulberry32 } from "@/lib/particles/rng";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { applyStateTransform } from "@/lib/particles/transform";
import { sphere } from "@/lib/particles/targets/sphere";
import { mesh, MESH_LABEL_ANCHORS } from "@/lib/particles/targets/mesh";
import { loop, LOOP_STATIONS } from "@/lib/particles/targets/loop";

const generators = { sphere, mesh, loop };

describe("rng", () => {
  test("deterministic and in [0,1)", () => {
    const a = mulberry32(7), b = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThan(1);
    }
  });
});

describe("states", () => {
  test("seven states, sphereFinal brighter than sphere", () => {
    expect(STATES).toHaveLength(7);
    expect(STATE_CONFIG.sphereFinal.brightness).toBeGreaterThan(STATE_CONFIG.sphere.brightness);
  });
});

describe("transform", () => {
  test("identity when spin and tilt are zero", () => {
    expect(applyStateTransform([1, 2, 3], 0, 0, 10)).toEqual([1, 2, 3]);
  });
  test("tilt of 90deg maps +y to +z", () => {
    const [x, y, z] = applyStateTransform([0, 1, 0], 0, Math.PI / 2, 0);
    expect(x).toBeCloseTo(0); expect(y).toBeCloseTo(0); expect(z).toBeCloseTo(1);
  });
  test("spin rotates around y by time*spin", () => {
    const [x, , z] = applyStateTransform([1, 0, 0], 1, 0, Math.PI / 2);
    expect(x).toBeCloseTo(0); expect(z).toBeCloseTo(-1);
  });
});

describe.each(Object.entries(generators))("%s target", (_, gen) => {
  test.each([1, 2, 997, 40000])("count %i → length, finite, bounded", (count) => {
    const arr = gen(count);
    expect(arr).toHaveLength(count * 3);
    for (const v of arr) { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(3); }
  });
  test("deterministic for same seed", () => expect(gen(500, 3)).toEqual(gen(500, 3)));
});

test("label anchors exist", () => {
  expect(MESH_LABEL_ANCHORS.map((a) => a.text)).toEqual(["AI-OS", "GPU", "MODEL", "DATA", "API"]);
  expect(LOOP_STATIONS).toHaveLength(6);
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run tests/unit/particles-core.test.ts`
Expected: FAIL (모듈 없음)

- [ ] **Step 3: rng** — `src/lib/particles/rng.ts`

```ts
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp3 = (v: number) => Math.max(-3, Math.min(3, v));
```

- [ ] **Step 4: 상태 설정** — `src/lib/particles/states.ts`

```ts
export const STATES = ["sphere", "mesh", "convergence", "loop", "moonshot", "korea", "sphereFinal"] as const;
export type StateName = (typeof STATES)[number];

export interface LineConfig { anchors: number; k: number; maxDist: number }
export interface StateConfig { spin: number; tilt: number; offsetX: number; brightness: number; lines: LineConfig | null }

// spin: rad/s (y축), tilt: rad (x축), offsetX: 데스크톱에서 오브젝트를 오른쪽으로 미는 거리
export const STATE_CONFIG: Record<StateName, StateConfig> = {
  sphere:      { spin: 0.06, tilt: 0.25, offsetX: 1.3, brightness: 1.0, lines: { anchors: 180, k: 2, maxDist: 0.9 } },
  mesh:        { spin: 0,    tilt: 1.05, offsetX: 1.1, brightness: 0.95, lines: { anchors: 220, k: 2, maxDist: 0.55 } },
  convergence: { spin: 0,    tilt: 0,    offsetX: 0.9, brightness: 1.0, lines: null },
  loop:        { spin: 0.12, tilt: 1.1,  offsetX: 1.2, brightness: 1.0, lines: null },
  moonshot:    { spin: 0.04, tilt: 1.2,  offsetX: 1.1, brightness: 1.0, lines: null },
  korea:       { spin: 0,    tilt: 0,    offsetX: 1.5, brightness: 0.95, lines: { anchors: 25, k: 3, maxDist: 2.2 } },
  sphereFinal: { spin: 0.09, tilt: 0.25, offsetX: 1.1, brightness: 1.35, lines: { anchors: 260, k: 3, maxDist: 1.0 } },
};
```

- [ ] **Step 5: 변환(셰이더와 동일)** — `src/lib/particles/transform.ts`

```ts
export type Vec3 = [number, number, number];

/** 셰이더 xf()와 동일: 먼저 y축으로 time*spin 회전, 다음 x축으로 tilt 기울임 */
export function applyStateTransform(p: Vec3, spin: number, tilt: number, time: number): Vec3 {
  const a = time * spin;
  const ca = Math.cos(a), sa = Math.sin(a);
  const x1 = ca * p[0] + sa * p[2];
  const y1 = p[1];
  const z1 = -sa * p[0] + ca * p[2];
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  const r: Vec3 = [x1, ct * y1 - st * z1, st * y1 + ct * z1];
  return r.map((v) => (Math.abs(v) < 1e-12 ? 0 : v)) as Vec3;
}
```

- [ ] **Step 6: sphere** — `src/lib/particles/targets/sphere.ts`

```ts
import { mulberry32, clamp3 } from "../rng";

/** 밀도가 고르지 않은 네트워크 구. 85%는 껍질, 15%는 내부. */
export function sphere(count: number, seed = 1): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const R = 1.6;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const denom = Math.max(1, count - 1);
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / denom) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    const shell = rand() < 0.15 ? 0.25 + 0.65 * rand() : 0.93 + 0.07 * rand();
    const k = R * shell;
    out[i * 3] = clamp3(Math.cos(th) * r * k);
    out[i * 3 + 1] = clamp3(y * k);
    out[i * 3 + 2] = clamp3(Math.sin(th) * r * k);
  }
  return out;
}
```

- [ ] **Step 7: mesh** — `src/lib/particles/targets/mesh.ts`

```ts
import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

const W = 4.4, D = 2.8, COLS = 11, ROWS = 7; // XZ 평면 격자 (tilt로 카메라를 향하게 함)
const gx = (c: number) => -W / 2 + (c / (COLS - 1)) * W;
const gz = (r: number) => -D / 2 + (r / (ROWS - 1)) * D;

export const MESH_LABEL_ANCHORS: { text: string; p: Vec3 }[] = [
  { text: "AI-OS", p: [gx(2), 0, gz(1)] },
  { text: "GPU", p: [gx(8), 0, gz(1)] },
  { text: "MODEL", p: [gx(5), 0, gz(3)] },
  { text: "DATA", p: [gx(2), 0, gz(5)] },
  { text: "API", p: [gx(8), 0, gz(5)] },
];

/** 70%는 격자선 위, 30%는 교차점 주변 클러스터 */
export function mesh(count: number, seed = 2): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x: number, z: number, y: number;
    if (rand() < 0.7) {
      if (rand() < 0.5) { x = gx(Math.floor(rand() * COLS)); z = -D / 2 + rand() * D; }
      else { z = gz(Math.floor(rand() * ROWS)); x = -W / 2 + rand() * W; }
      y = (rand() - 0.5) * 0.02;
    } else {
      const c = Math.floor(rand() * COLS), r = Math.floor(rand() * ROWS);
      const a = rand() * Math.PI * 2, d = Math.pow(rand(), 2) * 0.09;
      x = gx(c) + Math.cos(a) * d; z = gz(r) + Math.sin(a) * d; y = (rand() - 0.5) * 0.06;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3(z);
  }
  return out;
}
```

- [ ] **Step 8: loop** — `src/lib/particles/targets/loop.ts`

```ts
import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

const R = 1.55, TUBE = 0.1, N_STATIONS = 6;

export const LOOP_STATIONS: Vec3[] = Array.from({ length: N_STATIONS }, (_, i) => {
  const a = (i / N_STATIONS) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * R, 0, Math.sin(a) * R];
});

/** XZ 평면의 원형 루프(연구 순환). 25%는 6개 스테이션 주변에 밀집. */
export function loop(count: number, seed = 4): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (rand() < 0.25) {
      const s = LOOP_STATIONS[Math.floor(rand() * N_STATIONS)];
      const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1), d = Math.cbrt(rand()) * 0.16;
      x = s[0] + d * Math.sin(v) * Math.cos(u); y = d * Math.cos(v); z = s[2] + d * Math.sin(v) * Math.sin(u);
    } else {
      const a = rand() * Math.PI * 2, t = rand() * Math.PI * 2, d = TUBE * Math.sqrt(rand());
      const rr = R + Math.cos(t) * d;
      x = Math.cos(a) * rr; y = Math.sin(t) * d; z = Math.sin(a) * rr;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3(z);
  }
  return out;
}
```

- [ ] **Step 9: 통과 확인**

Run: `npx vitest run tests/unit/particles-core.test.ts`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: 파티클 상태 설정, 변환, sphere·mesh·loop 형태

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: 스크롤 → 상태 해석, reduced-motion 스냅, store

**Files:**
- Create: `src/lib/scroll/resolve.ts`, `src/lib/scroll/store.ts`, `tests/unit/resolve.test.ts`

**Interfaces:**
- Consumes: `STATES` (Task 4)
- Produces:
  - `interface ResolvedState { from: number; to: number; t: number }`
  - `resolveState(scrollY: number, boundaries: number[], zone: number): ResolvedState` — `boundaries[i]` = 상태 i → i+1 전환이 끝나는 scrollY(오름차순), `zone` = 전환 스크롤 거리(px)
  - `snapForReducedMotion(s: ResolvedState): ResolvedState`
  - `sameState(a, b): boolean`
  - `particleStore` (zustand vanilla, 초기값 `{from:0,to:0,t:1}`)

- [ ] **Step 1: 실패하는 테스트** — `tests/unit/resolve.test.ts`

```ts
import { describe, expect, test } from "vitest";
import { resolveState, snapForReducedMotion, sameState } from "@/lib/scroll/resolve";
import { particleStore } from "@/lib/scroll/store";

const B = [1000, 2000, 3000, 4000, 5000, 6000]; // 7개 상태 → 전환 6개
const Z = 400;

describe("resolveState", () => {
  test("top of page rests on state 0", () => expect(resolveState(0, B, Z)).toEqual({ from: 0, to: 0, t: 1 }));
  test("inside first transition", () => {
    const s = resolveState(800, B, Z);
    expect(s.from).toBe(0); expect(s.to).toBe(1); expect(s.t).toBeCloseTo(0.5);
  });
  test("between transitions rests on reached state", () => expect(resolveState(1500, B, Z)).toEqual({ from: 1, to: 1, t: 1 }));
  test("exactly at boundary end is next state at rest", () => expect(resolveState(1000, B, Z)).toEqual({ from: 1, to: 1, t: 1 }));
  test("after last boundary rests on final state", () => expect(resolveState(99999, B, Z)).toEqual({ from: 6, to: 6, t: 1 }));
  test("jump: far scroll resolves directly without intermediate states", () => {
    expect(resolveState(4700, B, Z)).toEqual({ from: 4, to: 4, t: 1 });
    const mid = resolveState(4800, B, Z);
    expect(mid.from).toBe(4); expect(mid.to).toBe(5);
  });
  test("negative scroll (overscroll bounce) clamps to state 0", () => expect(resolveState(-120, B, Z)).toEqual({ from: 0, to: 0, t: 1 }));
  test("zero zone switches instantly", () => {
    expect(resolveState(999, B, 0)).toEqual({ from: 0, to: 0, t: 1 });
    expect(resolveState(1000, B, 0)).toEqual({ from: 1, to: 1, t: 1 });
  });
  test("empty boundaries → always state 0", () => expect(resolveState(500, [], Z)).toEqual({ from: 0, to: 0, t: 1 }));
});

describe("snapForReducedMotion", () => {
  test("before halfway keeps source state", () => expect(snapForReducedMotion({ from: 2, to: 3, t: 0.3 })).toEqual({ from: 2, to: 2, t: 1 }));
  test("after halfway shows target state", () => expect(snapForReducedMotion({ from: 2, to: 3, t: 0.7 })).toEqual({ from: 3, to: 3, t: 1 }));
});

test("sameState compares all fields", () => {
  expect(sameState({ from: 1, to: 2, t: 0.5 }, { from: 1, to: 2, t: 0.5 })).toBe(true);
  expect(sameState({ from: 1, to: 2, t: 0.5 }, { from: 1, to: 2, t: 0.6 })).toBe(false);
});

test("store starts at rest on state 0", () => expect(particleStore.getState()).toEqual({ from: 0, to: 0, t: 1 }));
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run tests/unit/resolve.test.ts`
Expected: FAIL

- [ ] **Step 3: 구현** — `src/lib/scroll/resolve.ts`

```ts
export interface ResolvedState { from: number; to: number; t: number }

export function resolveState(scrollY: number, boundaries: number[], zone: number): ResolvedState {
  const z = Math.max(0, zone);
  for (let i = 0; i < boundaries.length; i++) {
    const end = boundaries[i];
    const start = end - z;
    if (scrollY < start) return { from: i, to: i, t: 1 };
    if (scrollY < end) return { from: i, to: i + 1, t: (scrollY - start) / z };
  }
  return { from: boundaries.length, to: boundaries.length, t: 1 };
}

export function snapForReducedMotion(s: ResolvedState): ResolvedState {
  const k = s.t >= 0.5 ? s.to : s.from;
  return { from: k, to: k, t: 1 };
}

export const sameState = (a: ResolvedState, b: ResolvedState) => a.from === b.from && a.to === b.to && a.t === b.t;
```

`src/lib/scroll/store.ts`
```ts
import { createStore } from "zustand/vanilla";
import type { ResolvedState } from "./resolve";

export const particleStore = createStore<ResolvedState>(() => ({ from: 0, to: 0, t: 1 }));
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run tests/unit/resolve.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 스크롤 위치를 파티클 상태로 해석하는 resolveState와 store

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: 파티클 프로토타입 렌더링(sphere → mesh → loop) + 입자 수·연결선

브리프 Step 3("먼저 Morph 3개만 구현, 성능 검증 후 나머지")에 해당. 이 Task에서는 나머지 4개 상태에 임시로 sphere 좌표를 넣고, Task 7에서 교체한다.

**Files:**
- Create: `src/lib/particles/count.ts`, `src/lib/particles/lines.ts`, `src/lib/particles/targets/index.ts`, `src/lib/scroll/useSectionScroll.ts`, `src/components/three/{shaders.ts,ParticleSystem.tsx,ParticleLines.tsx,ParticleScene.tsx,ParticleLayer.tsx}`, `tests/unit/count-lines.test.ts`, `tests/e2e/particles.spec.ts`
- Modify: `src/app/page.tsx` (임시로 3개 섹션 + ParticleLayer)

**Interfaces:**
- Consumes: `STATES`, `STATE_CONFIG`, `sphere/mesh/loop`, `particleStore`, `resolveState`, `snapForReducedMotion`, `sameState`
- Produces:
  - `particleCount(o: { width: number; cores?: number; reducedMotion: boolean }): number`
  - `nearestNeighborSegments(points: Float32Array, o: LineConfig): Float32Array` (세그먼트당 6 floats)
  - `buildAllTargets(count: number): Float32Array[]` (길이 7, STATES 순서)
  - `useSectionScroll(ids: readonly string[]): void` — `<html>`에 `data-particle-from`, `data-particle-to`, `data-motion`("full"|"reduced") 기록
  - `<ParticleLayer sectionIds={...} />` — 홈에서 한 번 렌더

- [ ] **Step 1: 실패하는 단위 테스트** — `tests/unit/count-lines.test.ts`

```ts
import { expect, test } from "vitest";
import { particleCount } from "@/lib/particles/count";
import { nearestNeighborSegments } from "@/lib/particles/lines";
import { buildAllTargets } from "@/lib/particles/targets";

test("particleCount tiers", () => {
  expect(particleCount({ width: 1440, reducedMotion: false })).toBe(40000);
  expect(particleCount({ width: 800, reducedMotion: false })).toBe(20000);
  expect(particleCount({ width: 390, reducedMotion: false })).toBe(8000);
});
test("particleCount halves on low core count but never below 5000", () => {
  expect(particleCount({ width: 1440, cores: 4, reducedMotion: false })).toBe(20000);
  expect(particleCount({ width: 390, cores: 2, reducedMotion: false })).toBe(5000);
});
test("particleCount reduced motion uses mobile tier", () => {
  expect(particleCount({ width: 1440, reducedMotion: true })).toBe(8000);
});

test("nearestNeighborSegments connects close points only", () => {
  const pts = new Float32Array([0, 0, 0, 0.1, 0, 0, 5, 5, 5]);
  const seg = nearestNeighborSegments(pts, { anchors: 3, k: 1, maxDist: 0.5 });
  expect(seg.length % 6).toBe(0);
  expect(seg.length / 6).toBe(1); // 0↔1 한 번만(중복 제거), 먼 점은 연결 안 됨
});
test("nearestNeighborSegments handles anchors > points", () => {
  const seg = nearestNeighborSegments(new Float32Array([0, 0, 0]), { anchors: 50, k: 3, maxDist: 1 });
  expect(seg.length).toBe(0);
});

test("buildAllTargets returns 7 arrays of count*3", () => {
  const t = buildAllTargets(300);
  expect(t).toHaveLength(7);
  t.forEach((a) => expect(a).toHaveLength(900));
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run tests/unit/count-lines.test.ts`
Expected: FAIL

- [ ] **Step 3: count·lines·targets index**

`src/lib/particles/count.ts`
```ts
export function particleCount(o: { width: number; cores?: number; reducedMotion: boolean }): number {
  let n = o.reducedMotion ? 8000 : o.width >= 1024 ? 40000 : o.width >= 640 ? 20000 : 8000;
  if (o.cores !== undefined && o.cores <= 4) n = Math.max(5000, Math.floor(n / 2));
  return n;
}
```

`src/lib/particles/lines.ts`
```ts
import type { LineConfig } from "./states";

/** 균등 간격으로 뽑은 앵커 점들 사이를 k-최근접(maxDist 이내)으로 연결. 중복 세그먼트 제거. */
export function nearestNeighborSegments(points: Float32Array, o: LineConfig): Float32Array {
  const n = points.length / 3;
  const m = Math.min(o.anchors, n);
  if (m < 2) return new Float32Array(0);
  const stride = n / m;
  const idx = Array.from({ length: m }, (_, i) => Math.floor(i * stride));
  const seen = new Set<string>();
  const out: number[] = [];
  const p = (i: number) => [points[i * 3], points[i * 3 + 1], points[i * 3 + 2]];
  for (let a = 0; a < m; a++) {
    const pa = p(idx[a]);
    const d: [number, number][] = [];
    for (let b = 0; b < m; b++) {
      if (a === b) continue;
      const pb = p(idx[b]);
      const dist = Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
      if (dist <= o.maxDist) d.push([dist, b]);
    }
    d.sort((x, y) => x[0] - y[0]);
    for (const [, b] of d.slice(0, o.k)) {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(...pa, ...p(idx[b]));
    }
  }
  return new Float32Array(out);
}
```

`src/lib/particles/targets/index.ts`
```ts
import { sphere } from "./sphere";
import { mesh } from "./mesh";
import { loop } from "./loop";

/** STATES 순서: sphere, mesh, convergence, loop, moonshot, korea, sphereFinal */
export function buildAllTargets(count: number): Float32Array[] {
  const s = sphere(count);
  // Task 7에서 convergence·moonshot·korea로 교체한다(프로토타입 단계 임시값).
  return [s, mesh(count), s, loop(count), s, s, s];
}
```

- [ ] **Step 4: 단위 테스트 통과 확인**

Run: `npx vitest run tests/unit/count-lines.test.ts`
Expected: PASS

- [ ] **Step 5: 셰이더** — `src/components/three/shaders.ts`

```ts
const xf = /* glsl */ `
uniform float uTime;
vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
vec3 tiltX(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 xf(vec3 p, float spin, float tilt){ return tiltX(rotY(p, uTime*spin), tilt); }
`;

export const pointsVertex = /* glsl */ `
${xf}
uniform float uProgress, uPixelRatio, uSize, uFromSpin, uToSpin, uFromTilt, uToTilt, uBrightness;
attribute vec3 aFrom; attribute vec3 aTo; attribute float aSeed; attribute vec3 aScatter;
varying float vAlpha; varying float vSeed;
void main(){
  float d = aSeed * 0.35;
  float t = clamp((uProgress - d) / 0.65, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 a = xf(aFrom, uFromSpin, uFromTilt);
  vec3 b = xf(aTo, uToSpin, uToTilt);
  vec3 p = mix(a, b, t) + aScatter * sin(t * 3.14159265) * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed * 0.8) / -mv.z;
  vAlpha = uBrightness * (0.35 + 0.65 * aSeed);
  vSeed = aSeed;
}`;

export const pointsFragment = /* glsl */ `
uniform vec3 uColorA; uniform vec3 uColorB;
varying float vAlpha; varying float vSeed;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float f = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(mix(uColorA, uColorB, vSeed), f * vAlpha * 0.9);
}`;

export const linesVertex = /* glsl */ `
${xf}
uniform float uSpin, uTilt;
void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(xf(position, uSpin, uTilt), 1.0); }`;

export const linesFragment = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity;
void main(){ gl_FragColor = vec4(uColor, uOpacity); }`;
```

- [ ] **Step 6: ParticleSystem** — `src/components/three/ParticleSystem.tsx`

```tsx
"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { mulberry32 } from "@/lib/particles/rng";
import { particleStore } from "@/lib/scroll/store";
import { snapForReducedMotion } from "@/lib/scroll/resolve";
import { pointsVertex, pointsFragment } from "./shaders";

export const CYAN = new THREE.Color("#3fd0d4");
export const BLUE = new THREE.Color("#4a8dff");

export function currentState(reduced: boolean) {
  const s = particleStore.getState();
  return reduced ? snapForReducedMotion(s) : s;
}

export function ParticleSystem({ targets, reducedMotion }: { targets: Float32Array[]; reducedMotion: boolean }) {
  const count = targets[0].length / 3;
  const { gl } = useThree();
  const attrs = useMemo(() => targets.map((a) => new THREE.BufferAttribute(a, 3)), [targets]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rand = mulberry32(99);
    const seed = new Float32Array(count);
    const scatter = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      seed[i] = rand();
      scatter[i * 3] = rand() * 2 - 1; scatter[i * 3 + 1] = rand() * 2 - 1; scatter[i * 3 + 2] = rand() * 2 - 1;
    }
    g.setAttribute("position", attrs[0]);
    g.setAttribute("aFrom", attrs[0]);
    g.setAttribute("aTo", attrs[0]);
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return g;
  }, [attrs, count]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uProgress: { value: 1 }, uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSize: { value: 26 },
      uFromSpin: { value: 0 }, uToSpin: { value: 0 }, uFromTilt: { value: 0 }, uToTilt: { value: 0 },
      uBrightness: { value: 1 }, uColorA: { value: CYAN }, uColorB: { value: BLUE },
    },
  }), []);
  const cur = useRef({ from: 0, to: 0 });
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const s = currentState(reducedMotion);
    if (s.from !== cur.current.from) { geometry.setAttribute("aFrom", attrs[s.from]); cur.current.from = s.from; }
    if (s.to !== cur.current.to) { geometry.setAttribute("aTo", attrs[s.to]); cur.current.to = s.to; }
    const f = STATE_CONFIG[STATES[s.from]], t = STATE_CONFIG[STATES[s.to]];
    const u = material.uniforms;
    u.uProgress.value = s.t;
    if (!reducedMotion) u.uTime.value += dt;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uFromSpin.value = reducedMotion ? 0 : f.spin; u.uToSpin.value = reducedMotion ? 0 : t.spin;
    u.uFromTilt.value = f.tilt; u.uToTilt.value = t.tilt;
    u.uBrightness.value = THREE.MathUtils.lerp(f.brightness, t.brightness, s.t);
    if (group.current) {
      const desktop = state.size.width >= 1024;
      group.current.position.x = desktop ? THREE.MathUtils.lerp(f.offsetX, t.offsetX, s.t) : 0;
    }
  });

  return <group ref={group} name="particles"><points geometry={geometry} material={material} frustumCulled={false} /></group>;
}
```

- [ ] **Step 7: ParticleLines** — `src/components/three/ParticleLines.tsx`

```tsx
"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { nearestNeighborSegments } from "@/lib/particles/lines";
import { linesVertex, linesFragment } from "./shaders";
import { CYAN, currentState } from "./ParticleSystem";

export function ParticleLines({ targets, reducedMotion }: { targets: Float32Array[]; reducedMotion: boolean }) {
  const { scene } = useThree();
  const geos = useMemo(() => STATES.map((name, i) => {
    const cfg = STATE_CONFIG[name].lines;
    if (!cfg) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(nearestNeighborSegments(targets[i], cfg), 3));
    return g;
  }), [targets]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: linesVertex, fragmentShader: linesFragment, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSpin: { value: 0 }, uTilt: { value: 0 }, uColor: { value: CYAN }, uOpacity: { value: 0 } },
  }), []);
  const lines = useMemo(() => new THREE.LineSegments(new THREE.BufferGeometry(), material), [material]);

  useFrame((_, dt) => {
    const s = currentState(reducedMotion);
    const geo = geos[s.to];
    const cfg = STATE_CONFIG[STATES[s.to]];
    if (!geo) { material.uniforms.uOpacity.value = 0; return; }
    if (lines.geometry !== geo) lines.geometry = geo;
    const arrive = s.from === s.to ? 1 : THREE.MathUtils.smoothstep(s.t, 0.85, 1);
    material.uniforms.uOpacity.value = 0.18 * cfg.brightness * arrive;
    if (!reducedMotion) material.uniforms.uTime.value += dt;
    material.uniforms.uSpin.value = reducedMotion ? 0 : cfg.spin;
    material.uniforms.uTilt.value = cfg.tilt;
    const particles = scene.getObjectByName("particles");
    if (particles) lines.position.copy(particles.position);
  });

  return <primitive object={lines} />;
}
```

> 연결선의 uTime은 ParticleSystem과 같은 dt로 누적되므로 두 레이어의 회전이 일치한다.

- [ ] **Step 8: 스크롤 훅** — `src/lib/scroll/useSectionScroll.ts`

```ts
"use client";
import { useEffect } from "react";
import { particleStore } from "./store";
import { resolveState, sameState } from "./resolve";

/** 섹션 i+1의 top이 뷰포트 35% 지점에 올 때 상태 i→i+1 전환이 끝나고, 그 앞 60vh가 전환 구간이다. */
export function useSectionScroll(ids: readonly string[]) {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let boundaries: number[] = [];
    let zone = 0;
    let raf = 0;

    const measure = () => {
      const vh = window.innerHeight;
      zone = vh * 0.6;
      boundaries = ids.slice(1).map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY - vh * 0.35 : Number.POSITIVE_INFINITY;
      });
      update();
    };
    const update = () => {
      raf = 0;
      const next = resolveState(window.scrollY, boundaries, zone);
      if (!sameState(next, particleStore.getState())) particleStore.setState(next, true);
      root.dataset.particleFrom = String(next.from);
      root.dataset.particleTo = String(next.to);
      root.dataset.motion = reduced.matches ? "reduced" : "full";
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", update);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids]);
}
```

- [ ] **Step 9: Scene·Layer**

`src/components/three/ParticleScene.tsx`
```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { buildAllTargets } from "@/lib/particles/targets";
import { ParticleSystem } from "./ParticleSystem";
import { ParticleLines } from "./ParticleLines";

export default function ParticleScene({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const targets = useMemo(() => buildAllTargets(count), [count]);
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ParticleSystem targets={targets} reducedMotion={reducedMotion} />
      <ParticleLines targets={targets} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
```

> reduced-motion에서 `frameloop="demand"`이면 스크롤 시 다시 그려야 한다. Step 10의 ParticleLayer가 store 구독으로 `invalidate()`를 호출한다.

`src/components/three/ParticleLayer.tsx`
```tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { invalidate } from "@react-three/fiber";
import { particleCount } from "@/lib/particles/count";
import { useSectionScroll } from "@/lib/scroll/useSectionScroll";
import { particleStore } from "@/lib/scroll/store";

const ParticleScene = dynamic(() => import("./ParticleScene"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export function ParticleLayer({ sectionIds }: { sectionIds: readonly string[] }) {
  useSectionScroll(sectionIds);
  const [cfg, setCfg] = useState<{ count: number; reduced: boolean } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!hasWebGL()) { root.dataset.webgl = "off"; return; }
    root.dataset.webgl = "on";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCfg({ count: particleCount({ width: window.innerWidth, cores: navigator.hardwareConcurrency, reducedMotion: reduced }), reduced });
  }, []);

  useEffect(() => particleStore.subscribe(() => invalidate()), []);

  if (!cfg) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <ParticleScene count={cfg.count} reducedMotion={cfg.reduced} />
    </div>
  );
}
```

- [ ] **Step 10: 임시 홈(3개 섹션)** — `src/app/page.tsx` 전체 교체

```tsx
import { ParticleLayer } from "@/components/three/ParticleLayer";

const IDS = ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"] as const;

export default function Home() {
  return (
    <>
      <ParticleLayer sectionIds={IDS} />
      {IDS.map((id) => (
        <section key={id} id={id} className="relative z-10 flex min-h-[140vh] items-start px-8 pt-32">
          <h2 className="text-3xl font-semibold">{id}</h2>
        </section>
      ))}
    </>
  );
}
```

- [ ] **Step 11: e2e 작성·실행** — `tests/e2e/particles.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("canvas mounts and scroll advances particle state", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "0");
  await page.locator("#autonomous").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "3");
  expect(errors).toEqual([]);
});
```

Run: `npm run test:e2e -- tests/e2e/particles.spec.ts`
Expected: PASS (desktop·mobile)

- [ ] **Step 12: 수동 성능 확인** — `npm run build && npx serve out -l 4173` 후 Chrome DevTools Performance로 스크롤 녹화. 40k 입자에서 전환 중 60fps(최소 50fps) 확인. 50fps 미만이면 `particleCount`의 데스크톱 값을 30000으로 낮추고 테스트 기대값도 함께 수정한다.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: 파티클 프로토타입(sphere→mesh→loop), 연결선, 스크롤 연동

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: 나머지 형태(convergence·moonshot·korea) + 라벨 투영

**Files:**
- Create: `src/lib/particles/geo.ts`, `src/lib/particles/targets/{convergence,moonshot,korea}.ts`, `src/lib/particles/labels.ts`, `src/components/three/ProjectedLabels.tsx`, `tests/unit/particles-more.test.ts`
- Modify: `src/lib/particles/targets/index.ts`, `src/components/three/ParticleScene.tsx`, `src/components/three/ParticleLayer.tsx`

**Interfaces:**
- Consumes: `mulberry32`, `clamp3`, `Vec3`, `applyStateTransform`, `INSTITUTES`, `korea-outline.json`, `MESH_LABEL_ANCHORS`, `LOOP_STATIONS`, `LOOP_STAGES`, `MISSIONS`
- Produces:
  - `project(lon: number, lat: number): [number, number]` (월드 x,y)
  - `pointInRing(x: number, y: number, ring: [number, number][]): boolean`
  - `samplePerimeter(ring: [number, number][], t: number): [number, number]` (t ∈ [0,1))
  - `convergence(count, seed?)`, `moonshot(count, seed?)`, `korea(count, seed?)` — 길이 `count*3`, `|v| ≤ 3`
  - `CONVERGENCE_LABELS`, `MOONSHOT_NODES: Vec3[]` (12개), `STATE_LABELS: Partial<Record<StateName, { text: string; p: Vec3 }[]>>`

- [ ] **Step 1: 실패하는 테스트** — `tests/unit/particles-more.test.ts`

```ts
import { describe, expect, test } from "vitest";
import { project, pointInRing, samplePerimeter } from "@/lib/particles/geo";
import { convergence } from "@/lib/particles/targets/convergence";
import { moonshot, MOONSHOT_NODES } from "@/lib/particles/targets/moonshot";
import { korea } from "@/lib/particles/targets/korea";
import { buildAllTargets } from "@/lib/particles/targets";
import { STATE_LABELS } from "@/lib/particles/labels";

describe("geo", () => {
  const square: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]];
  test("pointInRing", () => {
    expect(pointInRing(0.5, 0.5, square)).toBe(true);
    expect(pointInRing(1.5, 0.5, square)).toBe(false);
  });
  test("samplePerimeter walks the ring", () => {
    expect(samplePerimeter(square, 0)).toEqual([0, 0]);
    const [x, y] = samplePerimeter(square, 0.5);
    expect(x).toBeCloseTo(1); expect(y).toBeCloseTo(1);
  });
  test("project centers the peninsula within ±3", () => {
    for (const [lon, lat] of [[124.6, 33.1], [130.9, 43.0], [127.36, 36.37]]) {
      const [x, y] = project(lon, lat);
      expect(Math.abs(x)).toBeLessThan(3); expect(Math.abs(y)).toBeLessThan(3);
    }
  });
});

describe.each([["convergence", convergence], ["moonshot", moonshot], ["korea", korea]] as const)("%s", (_, gen) => {
  test.each([1, 2, 1001, 40000])("count %i", (count) => {
    const a = gen(count);
    expect(a).toHaveLength(count * 3);
    for (const v of a) { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(3); }
  });
  test("deterministic", () => expect(gen(400, 9)).toEqual(gen(400, 9)));
});

test("korea puts the brightest cluster in Daedeok", () => {
  const a = korea(20000);
  const [dx, dy] = project(127.36, 36.38);
  let near = 0;
  for (let i = 0; i < 20000; i++) if (Math.hypot(a[i * 3] - dx, a[i * 3 + 1] - dy) < 0.12) near++;
  expect(near / 20000).toBeGreaterThan(0.08);
});

test("moonshot has 12 nodes", () => expect(MOONSHOT_NODES).toHaveLength(12));

test("targets are all distinct after replacement", () => {
  const t = buildAllTargets(200);
  const keys = t.map((a) => a.slice(0, 6).join(","));
  expect(new Set(keys.slice(0, 6)).size).toBe(6); // sphereFinal은 sphere와 같아도 됨
});

test("labels cover mesh, convergence, loop, moonshot", () => {
  expect(Object.keys(STATE_LABELS).sort()).toEqual(["convergence", "loop", "mesh", "moonshot"]);
  expect(STATE_LABELS.moonshot).toHaveLength(12);
  expect(STATE_LABELS.loop?.map((l) => l.text)).toEqual(["질문", "탐색", "가설", "실험", "분석", "학습"]);
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run tests/unit/particles-more.test.ts`
Expected: FAIL

- [ ] **Step 3: geo** — `src/lib/particles/geo.ts`

```ts
const LON0 = 127.6, LAT0 = 38.05, S = 0.55, KX = Math.cos((37 * Math.PI) / 180);

/** 경위도 → 월드 좌표(XY 평면). 한반도(124–131°E, 33–43°N)가 ±3 안에 들어온다. */
export function project(lon: number, lat: number): [number, number] {
  return [(lon - LON0) * KX * S * 1.1, (lat - LAT0) * S];
}

export function pointInRing(x: number, y: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function samplePerimeter(ring: [number, number][], t: number): [number, number] {
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < ring.length; i++) {
    const l = Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
    seg.push(l); total += l;
  }
  let target = (((t % 1) + 1) % 1) * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const k = seg[i] === 0 ? 0 : Math.min(1, target / seg[i]);
      return [ring[i][0] + (ring[i + 1][0] - ring[i][0]) * k, ring[i][1] + (ring[i + 1][1] - ring[i][1]) * k];
    }
    target -= seg[i];
  }
  return ring[0];
}
```

- [ ] **Step 4: convergence** — `src/lib/particles/targets/convergence.ts`

```ts
import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

export const CONVERGENCE_LABELS: { text: string; p: Vec3 }[] = [
  { text: "Materials", p: [-2.6, 0.18, 0] },
  { text: "Biology", p: [2.6, 0.3, 0] },
  { text: "Energy", p: [0.25, 2.1, 0] },
  { text: "AI", p: [0.18, -2.1, 0] },
  { text: "Science × AI", p: [0, 0.62, 0] },
];

/** 네 방향 흐름(각 15%)이 중앙의 정렬 격자 블록(40%)으로 모인다. XY 평면. */
export function convergence(count: number, seed = 3): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const B = 0.45;
  for (let i = 0; i < count; i++) {
    const r = rand();
    let x: number, y: number, z = (rand() - 0.5) * 0.08;
    const u = rand(); // 흐름 위치 0(바깥)~1(중앙)
    if (r < 0.15) { x = -2.9 + u * 2.4; y = (rand() - 0.5) * 0.05; }                                   // 왼쪽: 점열
    else if (r < 0.3) { x = 2.9 - u * 2.4; y = Math.sin(u * 14) * 0.18 * (1 - u); }                   // 오른쪽: 사인파
    else if (r < 0.45) { y = 2.9 - u * 2.4; x = ((Math.floor(u * 12) % 2 ? 1 : -1) * (u * 12 % 1) - 0.5) * 0.25 * (1 - u); } // 위: 지그재그
    else if (r < 0.6) { y = -2.9 + u * 2.4; x = (rand() - 0.5) * 0.3 * (1 - u); }                      // 아래: 미세 점
    else {
      const n = 9, gx = Math.floor(rand() * n), gy = Math.floor(rand() * n);
      x = -B + (gx / (n - 1)) * 2 * B + (rand() - 0.5) * 0.03;
      y = -B + (gy / (n - 1)) * 2 * B + (rand() - 0.5) * 0.03;
      z = (rand() - 0.5) * 0.3;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3(z);
  }
  return out;
}
```

- [ ] **Step 5: moonshot** — `src/lib/particles/targets/moonshot.ts`

```ts
import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

const RING = 2.1;
export const MOONSHOT_NODES: Vec3[] = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return [Math.cos(a) * RING, 0, Math.sin(a) * RING];
});

/** 중앙 NAIS 코어(25%) + 얇은 궤도 링(25%) + 12개 노드 클러스터(50%). XZ 평면. */
export function moonshot(count: number, seed = 5): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const ball = (r: number): Vec3 => {
    const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1), d = Math.cbrt(rand()) * r;
    return [d * Math.sin(v) * Math.cos(u), d * Math.cos(v), d * Math.sin(v) * Math.sin(u)];
  };
  for (let i = 0; i < count; i++) {
    const r = rand();
    let p: Vec3;
    if (r < 0.25) p = ball(0.38);
    else if (r < 0.5) { const a = rand() * Math.PI * 2, j = (rand() - 0.5) * 0.04; p = [Math.cos(a) * (RING + j), j, Math.sin(a) * (RING + j)]; }
    else { const n = MOONSHOT_NODES[Math.floor(rand() * 12)], b = ball(0.15); p = [n[0] + b[0], n[1] + b[1], n[2] + b[2]]; }
    out[i * 3] = clamp3(p[0]); out[i * 3 + 1] = clamp3(p[1]); out[i * 3 + 2] = clamp3(p[2]);
  }
  return out;
}
```

- [ ] **Step 6: korea** — `src/lib/particles/targets/korea.ts`

```ts
import { mulberry32, clamp3 } from "../rng";
import { project, pointInRing, samplePerimeter } from "../geo";
import { INSTITUTES } from "@/content/institutes";
import outlineJson from "@/content/korea-outline.json";

const RINGS = (outlineJson as number[][][]).map((r) => r.map(([lon, lat]) => project(lon, lat)));
const RING_LEN = RINGS.map((r) => r.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - r[i - 1][0], p[1] - r[i - 1][1]) : 0), 0));
const TOTAL = RING_LEN.reduce((a, b) => a + b, 0);
const NODES = INSTITUTES.map((i) => project(i.lon, i.lat));
const BBOX = RINGS.flat().reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [9, 9, -9, -9]);

/** 윤곽선(55%) + 내부 채움(20%) + 기관 소재지 클러스터(25%). XY 평면. */
export function korea(count: number, seed = 6): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const pickRing = () => { let t = rand() * TOTAL; for (let k = 0; k < RINGS.length; k++) { if (t <= RING_LEN[k]) return k; t -= RING_LEN[k]; } return 0; };
  for (let i = 0; i < count; i++) {
    const r = rand();
    let x: number, y: number;
    if (r < 0.55) { [x, y] = samplePerimeter(RINGS[pickRing()], rand()); }
    else if (r < 0.75) {
      x = 0; y = 0;
      for (let tries = 0; tries < 30; tries++) {
        const cx = BBOX[0] + rand() * (BBOX[2] - BBOX[0]), cy = BBOX[1] + rand() * (BBOX[3] - BBOX[1]);
        if (RINGS.some((ring) => pointInRing(cx, cy, ring))) { x = cx; y = cy; break; }
      }
    } else {
      const n = NODES[Math.floor(rand() * NODES.length)], a = rand() * Math.PI * 2, d = Math.pow(rand(), 2) * 0.07;
      x = n[0] + Math.cos(a) * d; y = n[1] + Math.sin(a) * d;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3((rand() - 0.5) * 0.05);
  }
  return out;
}
```

- [ ] **Step 7: targets index 교체** — `src/lib/particles/targets/index.ts` 전체

```ts
import { sphere } from "./sphere";
import { mesh } from "./mesh";
import { convergence } from "./convergence";
import { loop } from "./loop";
import { moonshot } from "./moonshot";
import { korea } from "./korea";

/** STATES 순서: sphere, mesh, convergence, loop, moonshot, korea, sphereFinal(같은 구 좌표, 설정만 다름) */
export function buildAllTargets(count: number): Float32Array[] {
  const s = sphere(count);
  return [s, mesh(count), convergence(count), loop(count), moonshot(count), korea(count), s];
}
```

- [ ] **Step 8: 라벨 정의** — `src/lib/particles/labels.ts`

```ts
import type { StateName } from "./states";
import type { Vec3 } from "./transform";
import { MESH_LABEL_ANCHORS } from "./targets/mesh";
import { CONVERGENCE_LABELS } from "./targets/convergence";
import { LOOP_STATIONS } from "./targets/loop";
import { MOONSHOT_NODES } from "./targets/moonshot";
import { LOOP_STAGES, MISSIONS } from "@/content/home";

export const STATE_LABELS: Partial<Record<StateName, { text: string; p: Vec3 }[]>> = {
  mesh: MESH_LABEL_ANCHORS,
  convergence: CONVERGENCE_LABELS,
  loop: LOOP_STATIONS.map((p, i) => ({ text: LOOP_STAGES[i], p })),
  moonshot: MOONSHOT_NODES.map((p, i) => ({ text: MISSIONS[i].replace("Mission ", ""), p })),
};
```

- [ ] **Step 9: 단위 테스트 통과 확인**

Run: `npx vitest run`
Expected: 전체 PASS

- [ ] **Step 10: 라벨 투영 컴포넌트** — `src/components/three/ProjectedLabels.tsx`

```tsx
"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { STATE_LABELS } from "@/lib/particles/labels";
import { applyStateTransform } from "@/lib/particles/transform";
import { currentState } from "./ParticleSystem";

/** 도착한 상태(t ≥ 0.9)의 라벨만 표시. container는 캔버스 위 고정 div. */
export function ProjectedLabels({ container, reducedMotion }: { container: HTMLDivElement; reducedMotion: boolean }) {
  const { camera, scene, size } = useThree();
  const shown = useRef<number>(-1);
  const time = useRef(0);
  const v = new THREE.Vector3();

  useEffect(() => () => { container.replaceChildren(); }, [container]);

  useFrame((_, dt) => {
    if (!reducedMotion) time.current += dt;
    const s = currentState(reducedMotion);
    const target = s.t >= 0.9 ? s.to : -1;
    const name = target >= 0 ? STATES[target] : null;
    const labels = name ? STATE_LABELS[name] : undefined;
    if (target !== shown.current) {
      container.replaceChildren(...(labels ?? []).map((l) => {
        const el = document.createElement("span");
        el.textContent = l.text;
        el.className = "absolute left-0 top-0 whitespace-nowrap font-mono text-[11px] tracking-wider text-cyan/90";
        return el;
      }));
      shown.current = target;
    }
    if (!labels || !name) return;
    const cfg = STATE_CONFIG[name];
    const offset = scene.getObjectByName("particles")?.position.x ?? 0;
    const opacity = String(Math.min(1, (s.t - 0.9) / 0.1 + (s.from === s.to ? 1 : 0)));
    labels.forEach((l, i) => {
      const p = applyStateTransform(l.p, reducedMotion ? 0 : cfg.spin, cfg.tilt, time.current);
      v.set(p[0] + offset, p[1], p[2]).project(camera);
      const el = container.children[i] as HTMLElement | undefined;
      if (!el) return;
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width + 8}px, ${((1 - v.y) / 2) * size.height - 8}px)`;
      el.style.opacity = v.z < 1 ? opacity : "0";
    });
  });
  return null;
}
```

- [ ] **Step 11: Scene·Layer에 라벨 연결**

`ParticleScene.tsx`: props에 `labelContainer: HTMLDivElement | null` 추가, Canvas 안에 추가:
```tsx
{labelContainer && <ProjectedLabels container={labelContainer} reducedMotion={reducedMotion} />}
```
(import `ProjectedLabels` from "./ProjectedLabels", 시그니처는 `({ count, reducedMotion, labelContainer }: { count: number; reducedMotion: boolean; labelContainer: HTMLDivElement | null })`)

`ParticleLayer.tsx`: return 부분 교체
```tsx
const [labelEl, setLabelEl] = useState<HTMLDivElement | null>(null);
// ... (cfg 체크 이후)
return (
  <>
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <ParticleScene count={cfg.count} reducedMotion={cfg.reduced} labelContainer={labelEl} />
    </div>
    <div ref={setLabelEl} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] hidden lg:block" />
  </>
);
```
(`labelEl` useState는 다른 hook들과 함께 컴포넌트 상단, `if (!cfg) return null;` 앞에 선언한다.)

- [ ] **Step 12: e2e 재실행**

Run: `npm run test:e2e -- tests/e2e/particles.spec.ts`
Expected: PASS

- [ ] **Step 13: 시각 확인 스크립트** — 각 섹션 스크린샷을 남겨 형태가 의도대로인지 눈으로 확인

`tests/e2e/visual.spec.ts`
```ts
import { test } from "@playwright/test";
const IDS = ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"];
test("section screenshots", async ({ page }, info) => {
  await page.goto("/");
  for (const id of IDS) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `test-results/visual/${info.project.name}-${id}.png` });
  }
});
```
Run: `npm run test:e2e -- tests/e2e/visual.spec.ts` → `test-results/visual/*.png` 7장×2 확인. 형태가 알아보기 어려우면 해당 target 함수 상수(반경·비율)만 조정한다.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: convergence·moonshot·korea 형태와 3D 라벨 투영

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: 홈 섹션 UI(Hero~News) + 텍스트 등장 모션

**Files:**
- Create: `src/components/home/{Section,Hero,Platform,Convergence,Autonomous,Moonshot,Ecosystem,News,Reveal}.tsx`, `tests/e2e/home.spec.ts`
- Modify: `src/app/page.tsx`(전체 교체)

**Interfaces:**
- Consumes: `HOME_SECTIONS`, `HERO_SUB`, `PLATFORM_CARDS`, `CONVERGENCE_CARDS`, `AUTONOMOUS_POINTS`, `LOOP_STAGES`, `MOONSHOT_BODY`, `MISSIONS`, `ECOSYSTEM_BODY`, `NEWS`, `INSTITUTES`, `SITE`, `ParticleLayer`
- Produces: 섹션 id `hero…news`(스크롤 훅이 측정), 각 섹션 `aria-labelledby`.

- [ ] **Step 1: 실패하는 e2e** — `tests/e2e/home.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("hero shows official slogan as h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI로 과학을, 과학으로 미래를");
});

test("all seven sections are labelled regions in order", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"]);
  for (const id of ids) await expect(page.locator(`#${id}`)).toHaveAttribute("aria-labelledby", `${id}-title`);
});

test("What We Do wording, no '4대 추진과제'", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("What We Do")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("4대 추진과제");
});

test("news lists three real items and careers CTA", async ({ page }) => {
  await page.goto("/");
  const items = page.locator("#news li");
  await expect(items).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Join NAIS/ })).toHaveAttribute("href", "/careers/");
});

test("no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm run test:e2e -- tests/e2e/home.spec.ts --project=desktop`
Expected: FAIL

- [ ] **Step 3: 공통 섹션·등장 모션**

`src/components/home/Reveal.tsx`
```tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** 자식의 [data-reveal] 요소를 아래에서 올라오며 나타나게 한다. JS가 없거나 reduced-motion이면 처음부터 보인다. */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(ref.current!.querySelectorAll("[data-reveal]"), {
      y: 28, opacity: 0, duration: 0.9, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: ref.current, start: "top 75%" },
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
```

`src/components/home/Section.tsx`
```tsx
import { Reveal } from "./Reveal";

export function Section({ id, eyebrow, title, as = "h2", children }: {
  id: string; eyebrow: string; title: string; as?: "h1" | "h2"; children?: React.ReactNode;
}) {
  const H = as;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative z-10 min-h-[140vh] px-4 md:px-8">
      <Reveal className="mx-auto grid min-h-screen max-w-7xl items-center py-28 lg:grid-cols-12">
        <div className="relative lg:col-span-6 xl:col-span-5">
          <div aria-hidden="true" className="absolute -inset-x-8 -inset-y-10 -z-10 rounded-[40px] bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-transparent blur-2xl" />
          <p data-reveal className="eyebrow">{eyebrow}</p>
          <H data-reveal id={`${id}-title`} className={H === "h1" ? "mt-5 text-4xl font-bold leading-tight md:text-6xl" : "mt-4 text-3xl font-semibold leading-snug md:text-[2.6rem]"}>
            {title}
          </H>
          <div className="mt-8 space-y-6">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

export function CardGrid({ cards }: { cards: { label: string; title: string; body: string; status?: "planned" }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {cards.map((c) => (
        <li data-reveal key={c.label} className="rounded-lg border border-line bg-ink-900/80 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] tracking-widest text-cyan">{c.label}</span>
            {c.status === "planned" && <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">준비 중</span>}
          </div>
          <h3 className="mt-2 font-semibold">{c.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: 섹션 컴포넌트 7개**

`src/components/home/Hero.tsx`
```tsx
import { HOME_SECTIONS, HERO_SUB } from "@/content/home";
import { SITE } from "@/content/site";
import { Section } from "./Section";

export function Hero() {
  const s = HOME_SECTIONS[0];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} as="h1">
      <p data-reveal className="max-w-xl text-lg leading-relaxed text-fg/85">{HERO_SUB}</p>
      <p data-reveal className="text-sm text-muted">{SITE.vision}</p>
      <a data-reveal href="#platform" className="inline-flex items-center gap-2 font-mono text-sm text-cyan hover:underline">Explore NAIS ↓</a>
    </Section>
  );
}
```

`src/components/home/Platform.tsx`
```tsx
import { HOME_SECTIONS, PLATFORM_CARDS } from "@/content/home";
import { Section, CardGrid } from "./Section";

export function Platform() {
  const s = HOME_SECTIONS[1];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="font-mono text-xs tracking-widest text-muted">What We Do</p>
      <p data-reveal className="text-fg/85">연구자가 사용하는 개별 AI 기술이 아니라, 과학 AI를 움직이게 하는 공통 기반을 만듭니다.</p>
      <CardGrid cards={PLATFORM_CARDS} />
    </Section>
  );
}
```

`src/components/home/Convergence.tsx`
```tsx
import { HOME_SECTIONS, CONVERGENCE_CARDS } from "@/content/home";
import { Section, CardGrid } from "./Section";

export function Convergence() {
  const s = HOME_SECTIONS[2];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="text-fg/85">Where domain knowledge meets AI. 각 분야의 전문성과 AI를 결합해 현장에서 검증합니다.</p>
      <CardGrid cards={CONVERGENCE_CARDS} />
    </Section>
  );
}
```

`src/components/home/Autonomous.tsx`
```tsx
import { HOME_SECTIONS, AUTONOMOUS_POINTS, LOOP_STAGES } from "@/content/home";
import { Section, CardGrid } from "./Section";

export function Autonomous() {
  const s = HOME_SECTIONS[3];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <ol data-reveal className="flex flex-wrap gap-2 font-mono text-xs" aria-label="연구 순환 단계">
        {LOOP_STAGES.map((st, i) => (
          <li key={st} className="rounded-full border border-line px-3 py-1 text-muted">
            <span className="text-cyan">{String(i + 1).padStart(2, "0")}</span> {st}
          </li>
        ))}
      </ol>
      <CardGrid cards={AUTONOMOUS_POINTS} />
    </Section>
  );
}
```

`src/components/home/Moonshot.tsx`
```tsx
import { HOME_SECTIONS, MOONSHOT_BODY, MISSIONS } from "@/content/home";
import { Section } from "./Section";

export function Moonshot() {
  const s = HOME_SECTIONS[4];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="text-fg/85">{MOONSHOT_BODY}</p>
      <ul data-reveal className="grid grid-cols-3 gap-2 font-mono text-xs sm:grid-cols-4" aria-label="K-문샷 12개 미션">
        {MISSIONS.map((m) => (<li key={m} className="rounded border border-line px-2 py-1.5 text-center text-muted">{m}</li>))}
      </ul>
      <p data-reveal className="text-xs text-muted">미션별 명칭은 공식 발표에 맞춰 공개됩니다.</p>
    </Section>
  );
}
```

`src/components/home/Ecosystem.tsx`
```tsx
import { HOME_SECTIONS, ECOSYSTEM_BODY } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import { Section } from "./Section";

export function Ecosystem() {
  const s = HOME_SECTIONS[5];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="text-fg/85">{ECOSYSTEM_BODY}</p>
      <p data-reveal className="font-mono text-xs tracking-widest text-muted">Science connects.</p>
      <ul data-reveal className="flex flex-wrap gap-1.5 font-mono text-[11px] text-muted" aria-label="연결 연구기관">
        {INSTITUTES.map((i) => (<li key={i.code} title={`${i.nameKo} · ${i.city}`} className="rounded border border-line px-1.5 py-0.5">{i.code}</li>))}
      </ul>
    </Section>
  );
}
```

`src/components/home/News.tsx`
```tsx
import Link from "next/link";
import { HOME_SECTIONS, NEWS } from "@/content/home";
import { Section } from "./Section";

const fmt = (d: string) => d.replaceAll("-", ".");

export function News() {
  const s = HOME_SECTIONS[6];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <h3 data-reveal className="font-mono text-xs tracking-widest text-muted">Latest News</h3>
      <ul className="divide-y divide-line border-y border-line">
        {NEWS.map((n) => (
          <li data-reveal key={n.title} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr]">
            <time dateTime={n.date} className="font-mono text-xs text-cyan">{fmt(n.date)}</time>
            <div>
              <p className="font-medium">{n.href ? <Link className="hover:underline" href={n.href}>{n.title}</Link> : n.title}</p>
              <p className="text-sm text-muted">{n.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link data-reveal href="/careers/" className="inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-cyan/90">
        Join NAIS →
      </Link>
    </Section>
  );
}
```

- [ ] **Step 5: 홈 조립** — `src/app/page.tsx` 전체 교체

```tsx
import { HOME_SECTIONS } from "@/content/home";
import { ParticleLayer } from "@/components/three/ParticleLayer";
import { Hero } from "@/components/home/Hero";
import { Platform } from "@/components/home/Platform";
import { Convergence } from "@/components/home/Convergence";
import { Autonomous } from "@/components/home/Autonomous";
import { Moonshot } from "@/components/home/Moonshot";
import { Ecosystem } from "@/components/home/Ecosystem";
import { News } from "@/components/home/News";

const IDS = HOME_SECTIONS.map((s) => s.id);

export default function Home() {
  return (
    <>
      <ParticleLayer sectionIds={IDS} />
      <Hero /><Platform /><Convergence /><Autonomous /><Moonshot /><Ecosystem /><News />
    </>
  );
}
```

- [ ] **Step 6: 통과 확인**

Run: `npm run test:e2e -- tests/e2e/home.spec.ts tests/e2e/layout.spec.ts tests/e2e/particles.spec.ts`
Expected: 전체 PASS (desktop·mobile)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: 홈 7개 섹션 UI와 스크롤 등장 모션

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: 견고성 e2e(WebGL off·딥링크·리사이즈·reduced-motion)

Review Focus 항목을 e2e로 고정한다. 대부분 이미 구현된 동작을 검증하며, 실패 시 해당 모듈을 고친다.

**Files:**
- Create: `tests/e2e/robustness.spec.ts`
- Modify(실패 시에만): `src/lib/scroll/useSectionScroll.ts`, `src/components/three/ParticleLayer.tsx`

**Interfaces:**
- Consumes: `<html data-particle-from|data-particle-to|data-motion|data-webgl>` (Task 6)

- [ ] **Step 1: 테스트 작성** — `tests/e2e/robustness.spec.ts`

```ts
import { chromium, expect, test } from "@playwright/test";

test("webgl-off: content readable, no canvas, no errors", async ({ baseURL }) => {
  const browser = await chromium.launch({ args: ["--disable-webgl", "--disable-webgl2", "--disable-gpu"] });
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(baseURL + "/");
  await expect(page.locator("html")).toHaveAttribute("data-webgl", "off");
  await expect(page.locator("canvas")).toHaveCount(0);
  for (const id of ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"]) {
    await expect(page.locator(`#${id}-title`)).toBeVisible();
  }
  expect(errors).toEqual([]);
  await browser.close();
});

test("deep-link: /#moonshot resolves straight to state 4", async ({ page }) => {
  await page.goto("/#moonshot");
  await page.waitForTimeout(400);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "4");
});

test("resize: 1440 → 390 keeps no overflow and re-measures", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("#ecosystem").scrollIntoViewIfNeeded();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.locator("#ecosystem").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "5");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("reduced-motion: flagged and never mid-transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("#platform-title")).toBeVisible();
});
```

- [ ] **Step 2: 실행**

Run: `npm run test:e2e -- tests/e2e/robustness.spec.ts`
Expected: PASS. 실패 시:
- `webgl-off`에서 `data-webgl`이 `on`이면: 헤드리스 SwiftShader가 켜진 것. launch args에 `--use-gl=disabled`를 추가.
- `deep-link` 실패: `useSectionScroll`의 `measure()`가 폰트 로드 전에 끝나 경계가 틀린 경우. `window.addEventListener("load", measure)`를 추가하고 cleanup에서 제거.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test: WebGL 미지원, 딥링크, 리사이즈, reduced-motion e2e

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: 하위 페이지(준비 중)·404·sitemap·robots

**Files:**
- Create: `src/components/layout/ComingSoon.tsx`, `src/app/{about,research,programs,news,careers}/page.tsx`, `src/app/not-found.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `SITE`
- Produces: `out/{about,research,programs,news,careers}/index.html`, `out/404.html`, `out/sitemap.xml`, `out/robots.txt`

- [ ] **Step 1: 실패하는 e2e** — `tests/e2e/pages.spec.ts`

```ts
import { expect, test } from "@playwright/test";

for (const [path, title] of [["/about/", "About"], ["/research/", "Research"], ["/programs/", "Programs"], ["/news/", "News"], ["/careers/", "Careers"]]) {
  test(`${path} renders coming-soon page`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.getByRole("link", { name: "홈으로" })).toHaveAttribute("href", "/");
  });
}

test("sitemap lists home and five pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/about/", "/research/", "/programs/", "/news/", "/careers/"]) expect(xml).toContain(p);
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm run test:e2e -- tests/e2e/pages.spec.ts --project=desktop`
Expected: FAIL (404)

- [ ] **Step 3: 공통 컴포넌트** — `src/components/layout/ComingSoon.tsx`

```tsx
import Link from "next/link";

export function ComingSoon({ title, summary }: { title: string; summary: string }) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-5 px-4 pt-28 md:px-8">
      <p className="eyebrow">NAIS</p>
      <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
      <p className="text-lg text-muted">{summary}</p>
      <p className="text-sm text-muted">이 페이지는 준비 중입니다.</p>
      <Link href="/" className="font-mono text-sm text-cyan hover:underline">홈으로</Link>
    </section>
  );
}
```

- [ ] **Step 4: 페이지 5개** — 각 파일 전체

`src/app/about/page.tsx`
```tsx
import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { SITE } from "@/content/site";
export const metadata: Metadata = { title: "About" };
export default function Page() { return <ComingSoon title="About" summary={`${SITE.nameKo}는 ${SITE.mission.replace("합니다", "하는 조직입니다")}.`} />; }
```

`src/app/research/page.tsx`
```tsx
import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
export const metadata: Metadata = { title: "Research" };
export default function Page() { return <ComingSoon title="Research" summary="자율형 과학 시스템과 과학 AI 연구를 소개합니다." />; }
```

`src/app/programs/page.tsx`
```tsx
import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
export const metadata: Metadata = { title: "Programs" };
export default function Page() { return <ComingSoon title="Programs" summary="AI 융합연구사업과 공모 소식을 안내합니다." />; }
```

`src/app/news/page.tsx`
```tsx
import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
export const metadata: Metadata = { title: "News" };
export default function Page() { return <ComingSoon title="News" summary="NAIS의 소식과 공지를 전합니다." />; }
```

`src/app/careers/page.tsx`
```tsx
import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
export const metadata: Metadata = { title: "Careers" };
export default function Page() { return <ComingSoon title="Careers" summary="2026년도 NAIS 제3차 정규직 채용 접수는 10월 12일 14:00까지입니다." />; }
```

- [ ] **Step 5: 404·sitemap·robots**

`src/app/not-found.tsx`
```tsx
import { ComingSoon } from "@/components/layout/ComingSoon";
export default function NotFound() { return <ComingSoon title="페이지를 찾을 수 없습니다" summary="주소가 바뀌었거나 삭제된 페이지입니다." />; }
```

`src/app/sitemap.ts`
```ts
import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about/", "/research/", "/programs/", "/news/", "/careers/"].map((p) => ({ url: base + p, changeFrequency: "weekly" }));
}
```

`src/app/robots.ts`
```ts
import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
```

- [ ] **Step 6: 통과 확인**

Run: `npm run test:e2e -- tests/e2e/pages.spec.ts`
Expected: PASS. 404 페이지의 h1이 `페이지를 찾을 수 없습니다`인지 `out/404.html`에서 `grep` 확인: `grep -c "페이지를 찾을 수 없습니다" out/404.html` → 1 이상.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: 준비 중 하위 페이지, 404, sitemap, robots

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: 성능·접근성 측정과 배포 설정

**Files:**
- Create: `deploy/nginx.conf`, `scripts/lighthouse.mjs`
- Modify: `README.md`(배포 절차), `package.json`(`"lighthouse": "node scripts/lighthouse.mjs"`)

**Interfaces:**
- Consumes: `out/` 정적 산출물

- [ ] **Step 1: Lighthouse 스크립트** — `scripts/lighthouse.mjs` (먼저 `npm install -D lighthouse@13.5.0 chrome-launcher`)

```js
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:4173/";
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new"] });
const { lhr } = await lighthouse(url, { port: chrome.port, onlyCategories: ["performance", "accessibility", "seo"], formFactor: "mobile" });
await chrome.kill();
const s = (k) => Math.round(lhr.categories[k].score * 100);
const lcp = lhr.audits["largest-contentful-paint"].numericValue;
const cls = lhr.audits["cumulative-layout-shift"].numericValue;
console.log({ performance: s("performance"), accessibility: s("accessibility"), seo: s("seo"), lcpMs: Math.round(lcp), cls });
const ok = s("performance") >= 90 && s("accessibility") >= 95 && lcp < 2500 && cls < 0.1;
process.exit(ok ? 0 : 1);
```

- [ ] **Step 2: 측정**

Run: `npm run build && (npx serve out -l 4173 --no-clipboard &) && sleep 2 && npm run lighthouse`
Expected: exit 0, performance ≥ 90, accessibility ≥ 95, lcpMs < 2500, cls < 0.1.
미달 시 조치(순서대로 하나씩 적용 후 재측정):
1. Accessibility: 출력의 실패 감사 항목(대비·라벨)을 해당 컴포넌트에서 수정.
2. LCP: Hero h1이 LCP 요소인지 확인. `Reveal`이 h1을 `opacity:0`으로 시작시키면 LCP가 늦어지므로 Hero의 h1에서 `data-reveal` 제거.
3. Performance/TBT: `ParticleLayer`에서 `setCfg`를 `requestIdleCallback`(없으면 `setTimeout(…, 1200)`) 안으로 옮겨 3D 로드를 늦춘다.

- [ ] **Step 3: Nginx 설정** — `deploy/nginx.conf`

```nginx
server {
    listen 80;
    server_name example.com;           # 본인 도메인으로 교체
    root /var/www/nais-web;            # out/ 내용을 복사할 경로
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
    error_page 404 /404.html;

    location /_next/static/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location ~* \.(woff2|png|jpg|svg|ico)$ {
        add_header Cache-Control "public, max-age=2592000";
    }
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

- [ ] **Step 4: README 배포 절차 추가** — `README.md` 끝에 추가

````markdown
## 개발

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 단위 테스트
npm run test:e2e     # 빌드 + e2e
```

## 배포 (개인 서버 Nginx)

```bash
NEXT_PUBLIC_SITE_URL=https://<도메인> npm run build
rsync -av --delete out/ <user>@<server>:/var/www/nais-web/
# 서버: deploy/nginx.conf를 /etc/nginx/sites-available/에 두고 server_name 수정 후
sudo nginx -t && sudo systemctl reload nginx
```
````

- [ ] **Step 5: 전체 검증**

Run: `npm test && npm run test:e2e && npm run lint`
Expected: 모두 PASS, lint 에러 0

- [ ] **Step 6: Commit & Push**

```bash
git add -A
git commit -m "chore: Lighthouse 측정 스크립트, Nginx 배포 설정, README

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin main
```
