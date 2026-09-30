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
