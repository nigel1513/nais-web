// 출처: 국가과학기술연구회 조직도 (https://www.nst.re.kr/www/selectDeptWebList.do?key=13&searchDeptCode=nst_00001, 2026-09-30 확인)
// 직위·담당업무·전화번호를 옮기고 개인 이름은 싣지 않는다.
// 공식 페이지에 구성원이 게시되지 않은 단위는 staff를 비워 둔다.
export interface StaffRow { role: string; duties: string[]; phone: string }
export interface OrgUnit {
  id: string;
  name: string;
  nameEn: string;
  staff: StaffRow[];
  children: OrgUnit[];
}

const r = (role: string, phone: string, ...duties: string[]): StaffRow => ({ role, duties, phone });
const unit = (id: string, name: string, nameEn: string, staff: StaffRow[] = [], children: OrgUnit[] = []): OrgUnit =>
  ({ id, name, nameEn, staff, children });

const PD = (mission: string, phone: string) => r("국가특임연구원", phone, `K-문샷 프로그램 ${mission} 미션 총괄지휘자(PD)`);
const missionSupport = (mission: string, phone: string, part = "") => r("팀원", phone,
  `K-문샷 PD(${mission} 미션) 임무 수행 지원${part}`,
  `${mission} 미션 운영위원회 운영지원 및 미션 행정사무 수행${part}`,
  `${mission} 미션 연구‧산업 및 정책동향 조사‧분석 등${part}`);

export const ORG: OrgUnit = unit("center", "국가과학AI연구센터", "National AI for Science Research Center", [
  r("센터장", "042-288-7207", "국가과학AI연구센터 업무총괄"),
], [
  unit("kmoonshot", "K-문샷추진지원단", "K-Moonshot Support Group", [
    r("단장", "044-287-7431", "K-문샷추진지원단 업무 총괄"),
    PD("반도체", "044-287-7268"), PD("신약", "044-287-7269"), PD("태양전지", "044-287-7272"), PD("핵융합", "044-287-7273"),
    PD("휴머노이드", "044-287-7275"), PD("SMR선박", "044-287-7276"), PD("소재", "044-287-7277"), PD("양자", "044-287-7279"),
    PD("우주", "044-287-7280"), PD("BCI", "044-287-7292"),
  ], [
    unit("kmoonshot-team", "K-문샷추진지원팀", "K-Moonshot Support Team", [
      r("팀장", "044-287-7493", "K-문샷추진지원팀 업무 총괄"),
      r("팀원", "044-287-7320", "K-문샷 프로그램 추진 및 운영 실무 총괄", "K-문샷 프로그램 관련 대내외 협력 및 현안 대응", "추진지원단 인프라 구축 및 행정 운영", "추진지원단 인력운영 계획 수립"),
      r("팀원", "044-287-7281", "K-문샷 프로그램 미션별 추진 현황 모니터링 및 관리체계 개발", "K-문샷 미션별 지원기관(미션센터) 협력 및 네트워크 관리", "K-문샷 추진체계 운영 기획 및 조사·분석(Ⅰ)"),
      r("팀원", "044-287-7295", "정부 K-문샷 추진단 운영 지원(회의체 등)", "K-문샷 운영제도 정비 지원 및 제도개선 기획", "K-문샷 추진체계 운영 기획 및 조사·분석(Ⅱ)"),
      missionSupport("AI과학자", "044-287-7282"),
      missionSupport("신약", "044-287-7239"),
      missionSupport("태양전지", "044-287-7260", "(Ⅰ)"),
      missionSupport("태양전지", "044-287-7278", "(Ⅱ)"),
      missionSupport("BCI", "044-287-7263"),
      missionSupport("양자", "044-287-7274"),
      missionSupport("양자", "044-287-7296", "(Ⅱ)"),
      missionSupport("SMR선박", "044-287-7251", "(Ⅰ)"),
      missionSupport("SMR선박", "044-287-7293", "(Ⅱ)"),
      missionSupport("핵융합", "044-287-7294"),
      missionSupport("소재", "044-287-7297"),
      missionSupport("우주", "044-287-7443"),
    ]),
  ]),
  unit("hq", "과학AI본부", "Science AI Division", [
    r("본부장", "042-288-7218", "과학AI본부 업무총괄"),
  ], [
    unit("platform", "과학AI통합플랫폼운영단", "Science AI Platform Group", [], [
      unit("platform-team", "AI플랫폼팀", "AI Platform Team", [
        r("팀장", "042-288-7285", "AI플랫폼팀 업무 총괄"),
        r("팀원", "042-288-7286", "AI-OS 설계 및 구축", "프론티어 연구자 대상 AI 플랫폼 베타 서비스"),
        r("팀원", "042-288-7289", "AI 플랫폼 국가망 보안 체계 구축", "AI Ready Data 거버넌스 수립"),
        r("팀원", "042-288-7264", "AI 마켓플레이스 포탈 서비스 개발", "AI 플랫폼용 GPU 자원 관리 및 서비스 지원"),
        r("팀원", "042-288-7256", "AI-ready 데이터 파이프라인 개발", "AI 서비스 플랫폼 개발"),
      ]),
      unit("resource-team", "AI자원팀", "AI Resources Team"),
      unit("security-team", "AI보안팀", "AI Security Team"),
    ]),
    unit("convergence", "과학AI융합지원단", "Science AI Convergence Group", [], [
      unit("ax-team", "연구AX팀", "Research AX Team", [
        r("팀장", "042-288-7283", "연구AX팀 업무 총괄", "출연연 AX 전략 수립 및 협력 채널 운영"),
        r("팀원", "042-288-7284", "자율실험실 확산계획 수립 및 실행", "AI-ready 데이터셋 구축 및 품질관리"),
        // 원문의 "대형연구시실"은 "대형연구시설"의 오기로 보고 바로잡았다.
        r("팀원", "042-288-7284", "대형연구시설(가속기, 핵융합) 자율운전 에이전트 개발", "대형연구시설(가속기, 핵융합) 도메인 특화 모델 개발"),
        r("팀원", "042-288-7291", "출연연 AX 관련 교육 계획 수립 및 운영", "온톨로지 기반 지식구조 데이터 평가"),
      ]),
      unit("convergence-team", "AI융합팀", "AI Convergence Team"),
    ]),
  ]),
  unit("scientist", "자율형AI과학자연구단", "Autonomous AI Scientist Group", [], [
    unit("scientist-team", "AI과학자팀", "AI Scientist Team"),
  ]),
  unit("management", "경영전략부", "Management & Strategy Department", [
    r("부장", "042-288-7336", "경영전략부 업무 총괄"),
  ], [
    unit("support-team", "경영지원팀", "Management Support Team", [
      r("팀장", "042-288-7265", "경영지원팀 업무 총괄"),
      r("팀원", "042-288-7363", "NAIS 정규직(신규, 결원) 채용 지원", "NAIS 비정규직 직원(기간제, 인턴) 채용 지원", "채용브랜딩 및 채용사이트 관리"),
      r("팀원", "042-288-7180", "정규직(신규, 결원) 채용", "NAIS 비정규직 직원(기간제, 인턴) 채용", "NAIS 인사･조직 체계 제반 업무 수행"),
      r("팀원", "042-288-7325", "구매·계약 및 연구 인프라 관리", "연구시설장비심의위원회 제반 업무 수행"),
    ]),
    unit("strategy-team", "전략협력팀", "Strategy & Partnership Team", [
      r("팀장", "042-288-7225", "전략협력팀 업무 총괄"),
      r("팀원", "042-288-7386", "센터 사업 계획 수립", "센터 대내외 예산 관련 업무", "센터 관련 제도 개선 등 제반 업무"),
      r("팀원", "042-288-7287", "센터 주관 기본사업 등 연구사업 관리·운영", "센터 성과관리 및 확산 관련 업무", "센터 대외요구 자료 대응"),
      r("팀원", "042-288-7375", "센터 주관 기본사업 등 연구사업 관리·운영", "센터 성과관리 및 확산 관련 업무", "센터 대외 협력 및 홍보 관련 업무"),
    ]),
  ]),
]);

export function flattenOrg(u: OrgUnit): OrgUnit[] {
  return [u, ...u.children.flatMap(flattenOrg)];
}
