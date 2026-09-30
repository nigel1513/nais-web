import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
export const metadata: Metadata = { title: "News" };
export default function Page() { return <ComingSoon title="News" summary="NAIS의 소식과 공지를 전합니다." />; }
