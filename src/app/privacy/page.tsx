import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
export const metadata: Metadata = { title: "개인정보처리방침" };
export default function Page() { return <ComingSoon title="개인정보처리방침" summary="이 사이트는 방문자의 개인정보를 수집하지 않습니다." />; }
