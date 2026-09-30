import { HOME_SECTIONS, PLATFORM_ITEMS } from "@/content/home";
import { IndexedList } from "@/components/ui/IndexedList";
import { Section } from "./Section";

export function Platform() {
  const s = HOME_SECTIONS[1];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}
      lead="연구자가 쓰는 개별 AI 도구가 아니라, 과학 AI를 움직이게 하는 공통 기반을 만듭니다.">
      <IndexedList items={PLATFORM_ITEMS} />
    </Section>
  );
}
