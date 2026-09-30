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

export const NEWS: { date: string; title: string; detail: string; href?: string }[] = [
  { date: "2026-09-30", title: "NAIS AI 해커톤 본선", detail: "R&D 특화 AI 에이전트 · 성과 작성·연구행정 트랙 포함" },
  { date: "2026-09-29", title: "2026 NAIS AI 융합연구사업 Seed형 공모", detail: "접수 10월 20일까지 · 과제당 최대 2억 원" },
  { date: "2026-09-23", title: "2026년도 NAIS 제3차 정규직 채용 공고", detail: "연구직·연구기술직 29명 · 접수 10월 12일 14:00까지", href: "/careers/" },
];
