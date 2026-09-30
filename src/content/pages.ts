// 출처: reports/NAIS 국가과학AI연구센터 조사.md (각 항목의 source 링크), NST 조직도. 확인되지 않은 내용은 싣지 않는다.
import { RECRUIT_URL } from "./site";

export const ABOUT_FACTS = [
  { label: "업무 개시", value: "2026년 5월" },
  { label: "소속", value: "국가과학기술연구회" },
  { label: "2026년 예산", value: "400억 원" },
  { label: "지원 대상", value: "소관 연구기관 25곳" },
];

export const ABOUT_PURPOSE =
  "국가과학AI연구센터는 과학기술 분야의 AI 활용을 촉진하고, 연구기관 간 AI 기반 협업 생태계를 만들기 위해 국가과학기술연구회 안에 설치된 조직입니다. 출연연과 유기적인 협력체계를 갖추기 위해 출연연을 총괄 지원하는 국가과학기술연구회의 내부 조직으로 출범했습니다.";

export const HISTORY: { date: string; text: string }[] = [
  { date: "2025.08", text: "과학기술정보통신부 AI for S&T 추진단(TF) 구성" },
  { date: "2025.12", text: "국가인공지능전략위원회 행동계획에 국가과학기술연구회 산하 과학 AI 연구조직 신설 반영" },
  { date: "2026.01", text: "국가과학기술연구회 업무보고에서 국가과학AI연구소 설립 계획 발표" },
  { date: "2026.02", text: "과학기술×AI 국가전략(K-문샷)에서 국가과학AI연구센터를 자원 통합 플랫폼·협업 허브로 지정" },
  { date: "2026.04", text: "운영단 구성" },
  { date: "2026.05", text: "국가과학AI연구센터 업무 개시" },
  { date: "2026.07", text: "제2차 정규직 채용" },
  { date: "2026.08", text: "NAIS AI 해커톤 참가자 모집" },
  { date: "2026.09", text: "제3차 정규직 채용 공고, 2026 NAIS AI 융합연구사업(Seed형) 공모" },
];

export interface ResearchArea { id: string; eyebrow: string; title: string; lead: string; owner: string; ownerId: string; points: string[] }

export const RESEARCH: ResearchArea[] = [
  {
    id: "platform", eyebrow: "Science AI Platform", title: "과학AI 통합플랫폼",
    lead: "연구자가 모델·데이터·도구·컴퓨팅 자원을 한곳에서 쓰는 과학 AI 공통 기반(AI-OS)을 만듭니다.",
    owner: "과학AI통합플랫폼운영단", ownerId: "platform",
    points: ["AI-OS 설계 및 구축", "프론티어 연구자 대상 AI 플랫폼 베타 서비스", "AI 마켓플레이스 포털 서비스 개발", "AI 플랫폼용 GPU 자원 관리 및 서비스 지원", "AI-ready 데이터 파이프라인과 AI 서비스 플랫폼 개발", "AI 플랫폼 국가망 보안 체계 구축, AI Ready Data 거버넌스 수립"],
  },
  {
    id: "convergence", eyebrow: "Science AI Convergence", title: "과학AI 융합",
    lead: "출연연의 연구 현장에 AI를 적용하고, 그 결과를 다른 기관이 다시 쓸 수 있는 연구자산으로 만듭니다.",
    owner: "과학AI융합지원단", ownerId: "convergence",
    points: ["출연연 AX 전략 수립 및 협력 채널 운영", "자율실험실 확산계획 수립 및 실행", "AI-ready 데이터셋 구축 및 품질관리", "대형연구시설(가속기, 핵융합) 자율운전 에이전트와 도메인 특화 모델 개발", "출연연 AX 관련 교육 계획 수립 및 운영", "온톨로지 기반 지식구조 데이터 평가"],
  },
  {
    id: "autonomous", eyebrow: "Autonomous AI Scientist", title: "자율형 AI 과학자",
    lead: "AI가 가설을 세우고 실험을 설계·분석하는 자율형 연구 방식을 연구합니다. K-문샷의 AI과학자 미션과 함께 움직입니다.",
    owner: "자율형AI과학자연구단", ownerId: "scientist",
    points: ["AI 과학자 연구", "자율실험실 연계", "K-문샷 AI과학자 미션 지원"],
  },
  {
    id: "moonshot", eyebrow: "K-Moonshot", title: "K-문샷",
    lead: "과학기술×AI 국가전략(K-문샷)은 2035년까지 국가 임무에 AI로 도전합니다. 국가과학AI연구센터는 이 전략의 자원 통합 플랫폼이자 협업 허브이며, 미션별 총괄지휘자(PD)의 임무 수행을 지원합니다.",
    owner: "K-문샷추진지원단", ownerId: "kmoonshot",
    points: [],
  },
];

export const MOONSHOT_FIELDS = ["첨단바이오", "미래에너지", "피지컬AI", "우주", "소재", "AI과학자", "반도체", "양자"];

export interface Program {
  id: string; category: string; title: string; summary: string; period: { start: string; end: string; label: string };
  facts: { label: string; value: string }[]; details: string[]; source: { label: string; href: string };
}

export const PROGRAMS: Program[] = [
  {
    id: "seed", category: "공모", title: "2026 NAIS AI 융합연구사업 (Seed형)",
    summary: "출연연이 주관하고 산·학·연 기관과 함께 수행하는 과학 AI 융합연구 과제를 지원합니다.",
    period: { start: "2026-09-29", end: "2026-10-20", label: "2026.9.29 – 10.20 18:00" },
    facts: [
      { label: "과제당 지원", value: "최대 2억 원" },
      { label: "선정 규모", value: "약 15개 과제" },
      { label: "수행 기간", value: "1년" },
      { label: "접수 마감", value: "10.20 18:00" },
    ],
    details: [
      "출연연이 주관기관이 되고, 산·학·연 기관 1곳 이상과 협력해야 합니다.",
      "AI 전문가 멘토링, GPU, 공동 AI 모델·LLM·API를 지원합니다.",
      "성과(데이터셋, AI 에이전트 등 AI-ready 연구자산)는 과학AI 통합플랫폼(AI-OS)에 등록합니다.",
      "우수 과제 상위 약 30%는 실증형(연 5~10억 원)으로 연계됩니다.",
    ],
    source: { label: "아시아경제", href: "https://view.asiae.co.kr/article/2026092908544713390" },
  },
  {
    id: "hackathon", category: "행사", title: "2026 NAIS AI 해커톤",
    summary: "연구개발 현장에 특화된 AI 에이전트를 주제로 한 해커톤입니다.",
    period: { start: "2026-09-30", end: "2026-10-01", label: "본선 2026.9.30 – 10.1" },
    facts: [
      { label: "주제", value: "R&D 특화 AI 에이전트" },
      { label: "본선", value: "AI4Sci Korea 2026" },
      { label: "상금", value: "총 1천만 원" },
    ],
    details: ["트랙: 연구 기획·탐색 / 실험·데이터 분석 / 성과 작성·연구행정 / 자유주제"],
    source: { label: "로봇신문", href: "https://www.irobotnews.com/news/articleView.html?idxno=47994" },
  },
];

export interface Article { slug: string; date: string; category: "공모" | "행사" | "채용"; title: string; summary: string; body: string[]; link?: { label: string; href: string }; source: { label: string; href: string } }

export const ARTICLES: Article[] = [
  {
    slug: "hackathon-final", date: "2026-09-30", category: "행사", title: "NAIS AI 해커톤 본선 개최",
    summary: "R&D 특화 AI 에이전트를 주제로 한 해커톤 본선이 AI4Sci Korea 2026에서 열립니다.",
    body: ["2026 NAIS AI 해커톤 본선이 9월 30일부터 10월 1일까지 AI4Sci Korea 2026에서 열립니다.", "주제는 R&D 특화 AI 에이전트이며, 연구 기획·탐색, 실험·데이터 분석, 성과 작성·연구행정, 자유주제 트랙으로 진행됩니다. 상금은 총 1천만 원입니다."],
    link: { label: "사업 안내 보기", href: "/programs/#hackathon" },
    source: { label: "로봇신문", href: "https://www.irobotnews.com/news/articleView.html?idxno=47994" },
  },
  {
    slug: "seed-call", date: "2026-09-29", category: "공모", title: "2026 NAIS AI 융합연구사업(Seed형) 공모",
    summary: "과제당 최대 2억 원, 약 15개 과제를 선정합니다. 10월 20일 18시까지 접수합니다.",
    body: ["국가과학AI연구센터가 2026 NAIS AI 융합연구사업(Seed형) 과제를 공모합니다. 접수 기간은 9월 29일부터 10월 20일 18시까지입니다.", "출연연이 주관하고 산·학·연 기관 1곳 이상과 협력하는 과제를 대상으로 하며, 과제당 최대 2억 원, 약 15개 과제를 선정합니다. 선정 과제에는 AI 전문가 멘토링, GPU, 공동 AI 모델·LLM·API를 지원하고, 상위 약 30%는 실증형으로 연계합니다."],
    link: { label: "사업 안내 보기", href: "/programs/#seed" },
    source: { label: "아시아경제", href: "https://view.asiae.co.kr/article/2026092908544713390" },
  },
  {
    slug: "recruit-3rd", date: "2026-09-23", category: "채용", title: "2026년도 NAIS 제3차 정규직 채용 공고",
    summary: "연구직·연구기술직 29명을 채용합니다. 10월 12일 14시까지 접수합니다.",
    body: ["국가과학AI연구센터가 연구직 21명, 연구기술직 8명 등 29명을 채용합니다.", "모집 분야는 플랫폼, AX연구, 자율형과학시스템 분야로 나뉘며, 접수는 10월 12일(월) 14시까지 국가과학기술연구회 채용 사이트에서 받습니다."],
    link: { label: "채용 사이트 바로가기", href: RECRUIT_URL },
    source: { label: "세종시 일자리 게시판(공고 원문)", href: "https://www.sejong.go.kr/prog/recruit/job/sub01_02/view.do?pageIndex=1&cntNo=4316" },
  },
  {
    slug: "hackathon-call", date: "2026-08-18", category: "행사", title: "2026 NAIS AI 해커톤 참가자 모집",
    summary: "R&D 특화 AI 에이전트를 주제로 해커톤 참가자를 모집합니다.",
    body: ["국가과학AI연구센터가 R&D 특화 AI 에이전트를 주제로 한 2026 NAIS AI 해커톤 참가자를 모집합니다.", "연구 기획·탐색, 실험·데이터 분석, 성과 작성·연구행정, 자유주제 4개 트랙으로 진행됩니다."],
    link: { label: "사업 안내 보기", href: "/programs/#hackathon" },
    source: { label: "아시아경제", href: "https://view.asiae.co.kr/article/2026081808553934960" },
  },
];

export const programStatus = (p: Program, today = new Date("2026-09-30")) => {
  const s = new Date(p.period.start), e = new Date(p.period.end + "T23:59:59");
  return today < s ? "예정" : today > e ? "마감" : "진행 중";
};
