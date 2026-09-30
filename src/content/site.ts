// 출처: nais.re.kr 메타 태그(미션·슬로건·비전), 과기정통부 보도설명 2026-07-10(출범 시점)
// 채용공고는 국가과학기술연구회 채용 사이트에서 받는다
export const RECRUIT_URL = "https://nst.fairy.im/";

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
    { label: "Careers", href: RECRUIT_URL },
  ],
  footerGroups: [
    { title: "센터 소개", links: [{ label: "조직도", href: "/about/" }] },
    { title: "연구", links: [
      { label: "AI 플랫폼", href: "/#platform" }, { label: "AI 융합", href: "/#convergence" },
      { label: "자율형 AI 과학자", href: "/#autonomous" }, { label: "K-문샷", href: "/#moonshot" },
    ] },
    { title: "사업·소식", links: [{ label: "사업 공고", href: "/programs/" }, { label: "뉴스", href: "/news/" }] },
    { title: "채용", links: [{ label: "채용 안내", href: RECRUIT_URL }] },
  ],
  legalLinks: [
    { label: "개인정보처리방침", href: "/privacy/" },
    { label: "사이트맵", href: "/sitemap.xml" },
  ],
} as const;
