import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { SITE } from "@/content/site";
export const metadata: Metadata = { title: "About" };
export default function Page() { return <ComingSoon title="About" summary={`${SITE.nameKo}는 ${SITE.mission.replace("합니다", "하는 조직입니다")}.`} />; }
