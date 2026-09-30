# NAIS 홈페이지 설계 명세 (v2)

- 작성일: 2026-09-30
- 기반 문서: `NAIS_homepage_concept_brief.md` (브리프 v1). 이 명세에 없는 사항은 브리프 v1을 따른다.
- 사실 근거: `reports/NAIS 국가과학AI연구센터 조사.md`
- 범위: **프론트엔드 홈페이지만.** AI 기능(Ask NAIS, RAG, Agent, Chat)은 이번 범위에서 제외하며, 연구행정 Agent는 사용자가 별도 프로젝트로 개발한다.
- 기한: 5일 (2026-10-05까지 배포 가능한 상태)
- 배포: 개인 서버 + 개인 도메인, Next.js Static Export → Nginx

---

## 1. 브리프 v1 대비 확정된 변경 사항

| # | 항목 | v1 | v2 결정 |
|---|---|---|---|
| 1 | 비공식 표기 | Footer에 `Unofficial Concept Project` 필수 | **표기하지 않는다.** 공식 홈페이지 완성본을 가정한다. 단, 공식 로고 이미지·정부 상징은 사용하지 않고 직접 디자인한 NAIS 텍스트 워드마크를 쓴다. |
| 2 | Hero 헤드라인 | "AI로 과학의 발견 방식을 바꿉니다." | 헤드라인은 공식 슬로건 **"AI로 과학을, 과학으로 미래를"**. v1 문구는 서브카피로 사용. |
| 3 | 언어 | 한/영 혼용 | **한국어 주 언어.** 영어는 eyebrow·라벨·섹션 번호에만 사용. |
| 4 | Section 05 미션 명칭 | placeholder | 동일. 12개 미션 명칭은 공식 원문 확인 전까지 `Mission 01`~`Mission 12` + 분야 미표기. |
| 5 | Section 06 지도 | 서울·대구·포항·광주 예시 | 실제 기관 소재지 좌표로 점을 배치(대전 밀집이 자연스럽게 드러남). 좌표 데이터는 `content/institutes.ts`에 출처와 함께 관리. |
| 6 | Section 07 뉴스 | placeholder | 확인된 실제 소식 3건 사용(§4.7). |
| 7 | 연결선 | 미정의 | Particle과 별도의 **Line 레이어**를 둔다(§5.3). |
| 8 | 07 Sphere "더 풍부하게" | 입자 밀도 증가 | 입자 수는 고정. **밝기·연결선 밀도·회전 속도**로 차이를 준다. |

---

## 2. 확인된 콘텐츠 원천 (임의 생성 금지)

| 용도 | 문구/사실 | 출처 |
|---|---|---|
| 기관명 | 국가과학AI연구센터 / National AI for Science Research Center (NAIS) | nais.re.kr, 과기정통부 |
| 미션 | 과학기술분야 정부출연연구기관의 AI 전환을 견인합니다 | nais.re.kr 메타 |
| 슬로건 | AI로 과학을, 과학으로 미래를 | nais.re.kr 메타 |
| 비전 | 모든 연구자가 하나의 연구소가 되는 과학 AI 시대 | nais.re.kr 메타 |
| 핵심 영역 키워드 | AI 플랫폼 · 자율형 연구 · 융합 실증 · K-문샷 | nais.re.kr 메타 (홈에서는 "공식 4대 추진과제"라고 단정하지 않고 `What We Do`로 표기) |
| 조직 | 자율형과학시스템연구단(센터장 직속), 과학AI연구본부, 연구지원부 | nais.re.kr/about/org |
| 플랫폼 계획 | AI-OS(과학AI 통합플랫폼), AI 과학자 플랫폼(베타), 온프레미스 샌드박스 | 조사 보고서 [계획] |
| K-문샷 | 과학기술×AI 국가전략(2026.2), 2035년까지 12개 미션, NAIS = 자원 통합 플랫폼·협업 허브 | 조사 보고서 |
| 출범 | 2026년 5월 업무 개시 | 과기정통부 보도설명 2026.07.10 |

NST 표기는 두 곳으로 제한한다: Hero eyebrow 소속 한 줄(선택), Footer `국가과학기술연구회 국가과학AI연구센터`.

---

## 3. 시각 시스템

- 배경: Deep Navy / Near Black. 단일 다크 테마(의도적 단일 테마). `color-scheme: dark`.
- Primary: Scientific Cyan/Teal 1색. Secondary: Cool Blue. 텍스트: White / Cool Gray.
- 섹션 구분은 색이 아니라 **형태·밀도·밝기·흐름·연결 방식**으로 한다.
- 타이포: Pretendard(본문·헤드라인, 셀프 호스팅) + 모노스페이스 1종(라벨·숫자·섹션 번호).
- 워드마크: `NAIS` 텍스트 기반 직접 디자인(SVG). 공식 로고 미사용.
- 금지: NVIDIA 초록 복제, FutureHouse 색 복제, 무지개/네온/보라-파랑 SaaS 그라디언트, AI 뇌·로봇·회로기판·DNA·단백질 이미지.

---

## 4. 섹션 명세

공통 규칙
- 각 섹션은 데스크톱 기준 최소 100vh + 형태 전환 구간(스크롤 거리 약 60vh).
- 텍스트는 좌측 5/12 컬럼, 입자 오브젝트는 우측·중앙 영역. 모바일에서는 텍스트 우선 1열.
- 텍스트 뒤에는 반투명 그라디언트 scrim을 둬 대비 4.5:1 이상 확보.
- 모든 핵심 정보는 HTML 텍스트로 존재(Canvas 없이도 읽힘).

### 4.1 Hero / Mission — `sphere`
- eyebrow: `National AI for Science Research Center`
- H1: **AI로 과학을, 과학으로 미래를**
- 서브: AI로 과학의 발견 방식을 바꿉니다. 과학기술 분야의 AI 활용을 촉진하고 연구기관을 연결하는 AI for Science 허브.
- CTA: `Explore NAIS ↓` (다음 섹션 스크롤)
- 입자: NAIS Network Sphere. 밀도 불균일 구 + 표면 노드 간 연결선. 느린 회전, 마우스 패럴랙스 약하게.

### 4.2 AI Platform — `mesh`
- 헤드라인: 과학 AI를 위한 하나의 공통 기반
- 카드 5개: AI-OS · GPU/Compute · 공통 모델 · 데이터 · API (각 1~2문장, [계획] 항목은 "준비 중" 배지)
- 입자: 구가 펼쳐져 약간 기울어진 3D 격자 평면(Compute/Data Mesh). 격자 교차점에 라벨 5개.

### 4.3 AI Convergence / Research AX — `convergence`
- 헤드라인: AI와 과학 도메인을 연결합니다 / eyebrow `Where domain knowledge meets AI`
- 카드: AI 융합연구, 연구 AX, 실증(Seed·Pilot), AI-ready 연구자산
- 입자: 화면 네 방향(소재·생명·에너지·AI 라벨)에서 들어오는 네 줄기의 흐름이 중앙으로 모여 **작은 정렬 격자 블록**으로 합쳐진다. 각 흐름은 모양으로 구분(점열 / 사인파 / 지그재그 / 미세 점). 중앙 라벨 `Science × AI`.

### 4.4 Autonomous Science — `loop`
- 헤드라인: AI가 연구를 돕는 것을 넘어, 연구 과정 자체에 참여합니다
- 조직 연결: 자율형과학시스템연구단 명시
- 단계 라벨 6개: 질문 → 탐색 → 가설 → 실험 → 분석 → 학습
- 입자: 기울어진 원형 토러스 루프 위 6개 스테이션. 입자가 루프를 따라 계속 순환(셰이더 시간 기반). 스테이션에서 밝기 상승.

### 4.5 K-Moonshot — `moonshot`
- 헤드라인: 대한민국이 풀어야 할 과학기술 난제에 AI로 도전합니다
- 본문: 과학기술×AI 국가전략(K-문샷), 2035년까지 12개 미션, NAIS의 역할 = 자원 통합 플랫폼·협업 허브
- 입자: 중앙 NAIS 코어 + 궤도 링 위 12개 노드 클러스터. 노드 hover/focus 시 `Mission 01` 등 라벨.

### 4.6 Research Ecosystem — `korea`
- 헤드라인: 대한민국의 연구 역량을 하나의 AI 생태계로 연결합니다
- 본문: 출연연의 도메인 전문성부터 대학·산업계의 AI 역량까지
- 입자: 한반도 윤곽 점 샘플링(Natural Earth 1:50m, 퍼블릭 도메인) + 기관 소재지 노드(밝게) + 노드 간 연결선. 대덕 클러스터가 자연스럽게 가장 밝음.

### 4.7 News / Careers / Closing — `sphere` 회귀
- Latest News (실제 소식):
  - 2026.09.29 — 2026 NAIS AI 융합연구사업 Seed형 공모 (접수 ~10.20)
  - 2026.09.30 — NAIS AI 해커톤 본선 (R&D 특화 AI 에이전트)
  - 2026.09.23 — 2026년도 NAIS 제3차 정규직 채용 공고 (접수 ~10.12)
- Careers CTA: `Join NAIS →`
- Closing: Build the future of science with AI.
- 입자: 한반도 점들이 중앙으로 수렴해 Hero의 Sphere로 복귀. 연결선 밀도·밝기 상향.

### 4.8 Header / Footer
- Header: 워드마크 · About · Research · Programs · News · Careers. 스크롤 시 배경 블러. 스킵 링크.
- Footer: `NAIS / National AI for Science Research Center / 국가과학기술연구회 국가과학AI연구센터`, 링크 그룹, Contact·Privacy·Accessibility·Sitemap. 후속 페이지는 1차에서 "준비 중" 페이지로 라우팅.

---

## 5. 파티클 시스템

### 5.1 원칙
하나의 `THREE.Points`(BufferGeometry + ShaderMaterial)만 유지. 형태별 target position 배열을 미리 계산해 attribute로 보관하고, 셰이더에서 `mix(from, to, ease(progress))`로 보간.

### 5.2 상태
`0 sphere → 1 mesh → 2 convergence → 3 loop → 4 moonshot → 5 korea → 6 sphere(강조)`
- 한 번에 두 상태만 GPU에 바인딩(`aFrom`, `aTo`), 섹션 경계에서 교체.
- 각 입자는 `aSeed`로 전환 지연을 달리해 흩어졌다 모이는 느낌을 준다.
- 루프 순환·회전 같은 상태 내 움직임은 `uTime`으로 셰이더에서 처리.

### 5.3 연결선 레이어
- `THREE.LineSegments` 1개. sphere·mesh·korea·sphere(강조)에서만 표시.
- 형태 전환 중 opacity 0, 도착 후 페이드인.

### 5.4 입자 수 (성능 측정 후 조정)
Desktop 40k / Tablet 20k / Mobile 8k. `prefers-reduced-motion`이면 전환 애니메이션 없이 섹션별 정지 형태만 표시.

### 5.5 스크롤 연동
GSAP ScrollTrigger가 섹션별 progress(0→1)를 zustand 등 작은 store에 쓰고, 파티클 컴포넌트가 `useFrame`에서 읽어 uniform에 반영.

---

## 6. 기술 스택과 구조

- Next.js (App Router, `output: 'export'`), TypeScript, Tailwind CSS
- three + @react-three/fiber, GSAP + ScrollTrigger
- 3D 캔버스는 `dynamic(() => import(...), { ssr: false })`로 초기 렌더 이후 로드
- 디렉터리 구조는 브리프 v1 §19를 따르되 `lib/particleTargets/`의 각 파일은 `(count: number) => Float32Array` 순수 함수로 작성해 단위 테스트 가능하게 한다.
- `content/`에 뉴스·카드·기관 좌표 데이터를 두고 출처 주석을 남긴다.

---

## 7. 검증 기준

| 항목 | 기준 |
|---|---|
| 빌드 | `next build` 정적 export 성공, Nginx 로컬 서빙 확인 |
| 단위 테스트 | 각 target 함수: 길이 = count×3, NaN 없음, 경계 박스 범위 내 |
| 시각 확인 | Playwright로 섹션별 스크린샷(데스크톱 1440, 모바일 390) |
| 성능 | Lighthouse Performance ≥ 90 목표(모바일), LCP < 2.5s, CLS < 0.1 |
| 접근성 | Lighthouse Accessibility ≥ 95, 키보드 탐색, 스킵 링크, reduced-motion |
| WebGL 실패 | WebGL 미지원 시 캔버스 없이 모든 콘텐츠 정상 표시 |

---

## 8. 범위 밖 (이번 5일)
- AI 기능 전체(Ask NAIS, RAG, Agent, Chat)
- /about, /research, /programs, /news, /careers 상세 콘텐츠 (라우트와 "준비 중" 페이지만)
- 다국어 전환, CMS 연동
