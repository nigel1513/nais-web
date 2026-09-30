// 출처: reports/NAIS 국가과학AI연구센터 조사.md. [계획] 항목은 status: "planned"로 표시한다.
export const HOME_SECTIONS = [
  { id: "hero", eyebrow: "National AI for Science Research Center", title: "AI로 과학을, 과학으로 미래를" },
  { id: "platform", eyebrow: "What We Do · 01 AI Platform", title: "과학 AI를 위한 하나의 공통 기반" },
  { id: "convergence", eyebrow: "02 · AI Convergence", title: "AI와 과학 도메인을 연결합니다" },
  { id: "autonomous", eyebrow: "03 · Autonomous Science", title: "AI가 연구를 돕는 것을 넘어, 연구 과정 자체에 참여합니다" },
  { id: "moonshot", eyebrow: "04 · K-Moonshot", title: "대한민국이 풀어야 할 과학기술 난제에 AI로 도전합니다" },
  { id: "ecosystem", eyebrow: "05 · Research Ecosystem", title: "대한민국의 연구 역량을 하나의 AI 생태계로 연결합니다" },
  { id: "news", eyebrow: "News & Careers", title: "Build the future of science with AI." },
] as const;

export const HERO_SUB = "AI로 과학의 발견 방식을 바꿉니다. 과학기술 분야의 AI 활용을 촉진하고 연구기관을 연결하는 AI for Science 허브.";

export interface Item { title: string; body: string; badge?: string }

// 출처: NST 조직도 — AI플랫폼팀 담당 업무 (과학AI통합플랫폼운영단)
export const PLATFORM_ITEMS: Item[] = [
  { title: "AI-OS", body: "연구자가 모델·데이터·도구를 한곳에서 쓰는 과학 AI 운영 환경을 설계하고 구축합니다." },
  { title: "AI 플랫폼", body: "프론티어 연구자를 대상으로 AI 플랫폼 서비스를 먼저 엽니다.", badge: "Beta" },
  { title: "GPU 자원", body: "AI 플랫폼에서 쓰는 GPU 자원을 관리하고 연구과제에 배정합니다." },
  { title: "AI-ready 데이터", body: "연구데이터를 AI가 바로 쓸 수 있도록 파이프라인과 거버넌스를 만듭니다." },
  { title: "AI 마켓플레이스", body: "기관이 만든 모델과 도구를 서로 찾아 쓰는 포털을 개발합니다." },
];
export const PLATFORM_OWNER = "과학AI통합플랫폼운영단";

// 출처: NAIS AI 융합연구사업 Seed형 공고(2026-09-29), NST 조직도 — 연구AX팀 담당 업무 (과학AI융합지원단)
export const SEED_FACTS = [
  { label: "과제당 최대", value: "2", unit: "억 원" },
  { label: "선정 규모", value: "15", unit: "개 내외" },
  { label: "접수 마감", value: "10.20", unit: "" },
];
export const CONVERGENCE_ITEMS: Item[] = [
  { title: "출연연 AX 전략", body: "기관별 AX 전략을 함께 세우고 협력 채널을 운영합니다." },
  { title: "자율실험실 확산", body: "자율실험실을 여러 기관으로 넓히는 계획을 세우고 실행합니다." },
  { title: "대형연구시설 자율운전", body: "가속기·핵융합 시설을 위한 자율운전 에이전트와 도메인 특화 모델을 개발합니다." },
  { title: "AI-ready 데이터셋", body: "연구 현장의 데이터를 AI 학습에 맞게 구축하고 품질을 관리합니다." },
];
export const CONVERGENCE_OWNER = "과학AI융합지원단";

export const LOOP_STAGES = ["질문", "탐색", "가설", "실험", "분석", "학습"] as const;
export const AUTONOMOUS_BODY =
  "자율형AI과학자연구단은 AI가 가설을 세우고 실험을 설계·분석하는 연구 방식을 만듭니다. K-문샷의 AI과학자 미션과 함께 움직입니다.";

export const MOONSHOT_BODY =
  "과학기술×AI 국가전략(K-문샷)은 2035년까지 12개 미션에 도전합니다. NAIS는 이 전략의 자원 통합 플랫폼이자 협업 허브입니다.";

// 출처: NST 조직도의 K-문샷추진지원단 미션별 총괄지휘자(PD)·지원 업무 (2026-09-30 확인). 12번째 미션은 공개 자료에서 확인되지 않았다.
export const MISSIONS: { code: string; name: string }[] = [
  "AI과학자", "반도체", "신약", "태양전지", "핵융합", "휴머노이드", "SMR선박", "소재", "양자", "우주", "BCI", "명칭 확인 중",
].map((name, i) => ({ code: String(i + 1).padStart(2, "0"), name }));

export const ECOSYSTEM_BODY = "출연연의 도메인 전문성부터 대학·산업계의 AI 역량까지.";

export const NEWS: { date: string; category: string; title: string; detail: string; href: string }[] = [
  { date: "2026-09-30", category: "행사", title: "NAIS AI 해커톤 본선", detail: "R&D 특화 AI 에이전트를 주제로, 성과 작성·연구행정 트랙을 포함합니다.", href: "/news/" },
  { date: "2026-09-29", category: "공모", title: "2026 NAIS AI 융합연구사업 Seed형 공모", detail: "과제당 최대 2억 원, 10월 20일까지 접수합니다.", href: "/programs/" },
  { date: "2026-09-23", category: "채용", title: "2026년도 NAIS 제3차 정규직 채용", detail: "연구직·연구기술직 29명, 10월 12일 14:00까지 접수합니다.", href: "/careers/" },
];

export const NEXT_STEPS = [
  { title: "함께 연구할 사람을 찾습니다", body: "연구직·연구기술직 29명을 채용합니다.", link: "채용 안내", href: "/careers/" },
  { title: "AI 융합연구사업", body: "과학 AI 과제를 제안하고 GPU와 공용 모델을 지원받으세요.", link: "사업 공고 보기", href: "/programs/" },
  { title: "NAIS 조직", body: "센터를 구성하는 본부·단·팀과 하는 일을 소개합니다.", link: "조직도 보기", href: "/about/" },
];
