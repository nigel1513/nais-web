# 시스템 설명

NAIS Web의 구조, 주요 모듈, 설계 결정을 정리한 문서입니다.

## 1. 개요

| 항목 | 내용 |
|---|---|
| 목적 | 국가과학AI연구센터(NAIS)의 소개·연구·사업·소식을 전달하는 기관 홈페이지 |
| 형태 | 서버 없는 정적 사이트 (Next.js `output: "export"`) |
| 핵심 표현 | 스크롤에 따라 모양이 바뀌는 WebGL 입자 장면 (허브 구체 → 한반도 지도) |
| 언어 | 한국어 중심, 영어는 eyebrow·라벨·섹션 번호에만 사용 |
| 범위 | 프론트엔드만. 채용은 국가과학기술연구회 채용 사이트로 연결 |

## 2. 전체 구조

```
브라우저
 ├─ HTML/CSS (정적 프리렌더, 콘텐츠 먼저 표시)
 └─ ParticleLayer (클라이언트, 지연 로드)
      ├─ useSectionScroll ──► particleStore (Zustand)
      │     스크롤 위치 → {from, to, t} 섹션 전환 상태
      └─ ParticleScene (React Three Fiber, WebGL2)
            ├─ ParticleSystem   입자 위치 보간 + 셰이더
            ├─ HubLayers        허브 구체의 기관 노드·연결선
            ├─ KoreaFlows       한반도 지도 위 데이터 흐름 패킷
            └─ ProjectedLabels  3D 좌표를 HTML 라벨로 투영

빌드 ─► out/ (정적 파일) ─► Nginx
```

## 3. 디렉터리

```
src/
├─ app/                 라우트 (App Router)
│  ├─ page.tsx          홈: 7개 섹션 + 입자 레이어
│  ├─ about/            센터 소개 · history · organization · contact
│  ├─ research/         4대 연구 분야
│  ├─ programs/         사업 공고와 모집 상태
│  ├─ news/[slug]/      소식 목록과 상세 (generateStaticParams)
│  ├─ sitemap.ts, robots.ts
├─ components/
│  ├─ home/             홈 섹션 (Hero, Platform, Convergence, Autonomous, Moonshot, Ecosystem, News)
│  ├─ three/            WebGL 장면, GLSL 셰이더, 오류 경계
│  ├─ about/            조직도(OrgChart), 직원 표(StaffTable)
│  ├─ layout/           Header, Footer, MobileMenu, Wordmark
│  ├─ page/             PageHero, SubNav, NewsList
│  └─ ui/               CountUp, Scramble, CycleWords, ProgramStatus 등
├─ content/             모든 문구·데이터 (출처 주석 포함)
│  ├─ site.ts           사이트 메타, 내비게이션, 푸터
│  ├─ home.ts           홈 섹션 문구
│  ├─ pages.ts          소개·연혁·연구·사업·소식
│  ├─ organization.ts   조직도 트리
│  ├─ institutes.ts     소관 연구기관 25곳 (분야·좌표·CI)
│  └─ korea-outline.json 한반도 경계 (scripts/build-korea-outline.mjs로 생성)
└─ lib/
   ├─ particles/        입자 목표 형태·상태·흐름 계산 (순수 함수)
   └─ scroll/           스크롤 → 섹션 전환 상태
```

콘텐츠와 표현을 분리했습니다. 문구를 고칠 때는 `src/content/`만 수정하면 됩니다.

## 4. 입자 시스템

### 4.1 목표 형태
`lib/particles/targets/`가 입자 수만큼의 목표 좌표(`Float32Array`)를 만듭니다.

- **sphere / network** — NAIS 허브 구체. 경도는 6개 연구 분야(물리·화학·생명·에너지·ICT·공학), 위도는 기초(위)→응용(아래) 과학을 뜻합니다.
- **korea** — 한반도 경계 폴리곤 안을 격자로 채운 도트 매트릭스. 남한은 채우고 북한은 외곽선만 그립니다.

난수는 시드 고정 `mulberry32`를 써서 매번 같은 모양이 나옵니다.

### 4.2 섹션별 상태
`lib/particles/states.ts`의 `STATE_CONFIG`가 7개 상태(hero, platform, convergence, autonomous, moonshot, ecosystem, closing)마다 크기·회전(yaw)·기울기(tilt)·유체 흐름(flow)·소용돌이(swirl)·밝기·색조를 정의합니다. 형태는 구 하나로 유지하고 분위기만 바꾸며, 생태계 섹션에서만 한반도 지도로 바뀝니다. 두 상태 사이는 smoothstep으로 보간합니다.

### 4.3 스크롤 연동
`useSectionScroll`은 다음 섹션의 top이 뷰포트 35% 지점에 올 때 전환이 끝나도록, 그 앞 60vh를 전환 구간으로 잡습니다. 결과는 Zustand 스토어에 넣고, R3F는 on-demand 렌더링(`invalidate`)으로 바뀔 때만 다시 그립니다.

### 4.4 렌더링
- 입자: 커스텀 vertex/fragment 셰이더, curl noise 유체 흐름, 가산 혼합 글로우
- 한반도 흐름: 각 기관에서 NAIS로 향하는 베지어 호를 따라 패킷이 이동 (GPU에서 위치 계산)
- 라벨: 3D 노드 좌표를 매 프레임 화면 좌표로 투영해 HTML로 표시(데스크톱만)

### 4.5 성능·호환성
| 조건 | 처리 |
|---|---|
| 화면 폭 ≥1024 / ≥640 / 그 외 | 입자 40,000 / 20,000 / 8,000 |
| CPU 코어 ≤4 | 입자 수 절반 (최소 5,000) |
| `prefers-reduced-motion` | 8,000개, 움직임 최소화 |
| WebGL2 미지원 | 3D 레이어 생략, `data-webgl="off"` |
| 셰이더 오류 | `SceneBoundary` 오류 경계로 콘텐츠만 표시 |
| 초기 로딩 | 데스크톱은 유휴 시점, 모바일은 첫 스크롤 또는 4초 후 3D 로드 |

## 5. 페이지

| 경로 | 내용 |
|---|---|
| `/` | 히어로 · AI 플랫폼 · AI 융합 · 자율형 AI 과학자 · K-문샷 · 연구 생태계(25개 기관) · 소식 |
| `/about/` | 설립 목적, 업무 개시, 예산, 지원 대상 |
| `/about/history/` | 연혁 이정표 |
| `/about/organization/` | 위→아래 조직도, 부서 선택 시 직위·담당업무·전화 표 |
| `/about/contact/` | 문의처 |
| `/research/` | 과학AI 통합플랫폼 · 융합 · 자율형 AI 과학자 · K-문샷 |
| `/programs/` | AI 융합연구사업(Seed형) · AI 해커톤, 일정과 모집 상태 |
| `/news/`, `/news/[slug]/` | 분류 필터 목록과 상세 |

### 사업 모집 상태
`programStatus(program, now)`가 한국 시간 기준 시작·마감 시각으로 `예정 / 진행 중 / 마감`을 판정합니다. 정적 빌드 값으로 먼저 그린 뒤, 브라우저에서 즉시 그리고 1분마다 다시 계산합니다. 홈의 모집 문구도 같은 함수로 자동 전환됩니다.

## 6. 테스트

| 종류 | 도구 | 대상 |
|---|---|---|
| 단위 | Vitest | 입자 목표 형태, 상태 보간, 스크롤 해석, 허브·흐름 계산, 기관 데이터·CI 파일 일치, 조직도, 모집 상태 |
| e2e | Playwright (데스크톱 1440×900, Pixel 7) | 홈·하위 페이지 렌더링, 좌우 기준선 정렬, 레이아웃 넘침, 모바일 메뉴, WebGL 없을 때의 동작, 시계 조작으로 모집 상태 검증, 섹션별 스크린샷 |
| 성능 | Lighthouse | 모바일 성능·접근성 점수 |

## 7. 배포

1. `NEXT_PUBLIC_SITE_URL=https://<도메인> npm run build` → `out/`
2. `rsync`로 서버 `/var/www/nais-web/`에 복사
3. `deploy/nginx.conf` 적용: `try_files`로 trailing slash 경로 처리, `/_next/static/` 1년 immutable 캐시, 이미지·폰트 30일 캐시, gzip

## 8. 콘텐츠 원칙

- 공개된 공식 자료(센터 사이트, 국가과학기술연구회 조직도·공고, 과기정통부 보도자료)에서 확인한 사실만 씁니다.
- 각 데이터 파일 상단에 출처를 주석으로 남깁니다.
- 공식 로고·정부 상징은 쓰지 않고 직접 디자인한 텍스트 워드마크를 씁니다. 소관 연구기관 CI 출처는 `public/ci/SOURCE.md`에 있습니다.
