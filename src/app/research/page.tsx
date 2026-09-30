import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";
export const metadata: Metadata = { title: "Research" };
export default function Page() { return <ComingSoon title="Research" summary="자율형 과학 시스템과 과학 AI 연구를 소개합니다." />; }
