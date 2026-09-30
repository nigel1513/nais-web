// 국가과학기술연구회 소관연구기관 25개(https://www.nst.re.kr/www/contents.do?key=20, 2026-09-30 확인,).
// 좌표는 각 기관 공식 주소 기준 도시 수준 근사값(시각화용, ±1km). CI는 public/ci/{code}.png.
// 배포 전 기관 홈페이지 주소로 재확인할 것.
export interface Institute { code: string; nameKo: string; city: string; lon: number; lat: number; ci: { width: number; height: number } }

export const INSTITUTES: Institute[] = [
  { code: "KIST", nameKo: "한국과학기술연구원", city: "서울", lon: 127.0466, lat: 37.6036 , ci: { width: 190, height: 46 } },
  { code: "NIGT", nameKo: "국가녹색기술연구소", city: "서울", lon: 126.9975, lat: 37.5635 , ci: { width: 86, height: 67 } },
  { code: "KBSI", nameKo: "한국기초과학지원연구원", city: "대전", lon: 127.3625, lat: 36.3724 , ci: { width: 191, height: 24 } },
  { code: "KASI", nameKo: "한국천문연구원", city: "대전", lon: 127.3614, lat: 36.3736 , ci: { width: 193, height: 52 } },
  { code: "KRIBB", nameKo: "한국생명공학연구원", city: "대전", lon: 127.3587, lat: 36.3735 , ci: { width: 196, height: 44 } },
  { code: "KISTI", nameKo: "한국과학기술정보연구원", city: "대전", lon: 127.3603, lat: 36.3913 , ci: { width: 199, height: 41 } },
  { code: "KIOM", nameKo: "한국한의학연구원", city: "대전", lon: 127.354, lat: 36.3925 , ci: { width: 157, height: 68 } },
  { code: "KITECH", nameKo: "한국생산기술연구원", city: "천안", lon: 127.152, lat: 36.8453 , ci: { width: 173, height: 51 } },
  { code: "ETRI", nameKo: "한국전자통신연구원", city: "대전", lon: 127.3664, lat: 36.3826 , ci: { width: 199, height: 23 } },
  { code: "NSR", nameKo: "국가보안기술연구소", city: "대전", lon: 127.37, lat: 36.39 , ci: { width: 114, height: 39 } },
  { code: "KICT", nameKo: "한국건설기술연구원", city: "고양", lon: 126.765, lat: 37.6697 , ci: { width: 199, height: 47 } },
  { code: "KRRI", nameKo: "한국철도기술연구원", city: "의왕", lon: 126.9536, lat: 37.3916 , ci: { width: 198, height: 34 } },
  { code: "KRISS", nameKo: "한국표준과학연구원", city: "대전", lon: 127.3717, lat: 36.3886 , ci: { width: 134, height: 70 } },
  { code: "KFRI", nameKo: "한국식품연구원", city: "완주", lon: 127.05, lat: 35.84 , ci: { width: 202, height: 31 } },
  { code: "WiKim", nameKo: "세계김치연구소", city: "광주", lon: 126.84, lat: 35.18 , ci: { width: 105, height: 55 } },
  { code: "KIGAM", nameKo: "한국지질자원연구원", city: "대전", lon: 127.357, lat: 36.3749 , ci: { width: 204, height: 24 } },
  { code: "KIMM", nameKo: "한국기계연구원", city: "대전", lon: 127.3571, lat: 36.3918 , ci: { width: 197, height: 36 } },
  { code: "KIMS", nameKo: "한국재료연구원", city: "창원", lon: 128.676, lat: 35.192 , ci: { width: 202, height: 34 } },
  { code: "KARI", nameKo: "한국항공우주연구원", city: "대전", lon: 127.3565, lat: 36.3735 , ci: { width: 199, height: 52 } },
  { code: "KIER", nameKo: "한국에너지기술연구원", city: "대전", lon: 127.357, lat: 36.38 , ci: { width: 199, height: 37 } },
  { code: "KERI", nameKo: "한국전기연구원", city: "창원", lon: 128.717, lat: 35.19 , ci: { width: 200, height: 22 } },
  { code: "KRICT", nameKo: "한국화학연구원", city: "대전", lon: 127.36, lat: 36.3755 , ci: { width: 201, height: 31 } },
  { code: "KIT", nameKo: "국가독성과학연구소", city: "대전", lon: 127.349, lat: 36.3895 , ci: { width: 82, height: 66 } },
  { code: "KAERI", nameKo: "한국원자력연구원", city: "대전", lon: 127.371, lat: 36.426 , ci: { width: 199, height: 55 } },
  { code: "KFE", nameKo: "한국핵융합에너지연구원", city: "대전", lon: 127.366, lat: 36.366 , ci: { width: 201, height: 25 } },
];
