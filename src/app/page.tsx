import { HOME_SECTIONS } from "@/content/home";
import { ParticleLayer } from "@/components/three/ParticleLayer";
import { Hero } from "@/components/home/Hero";
import { Platform } from "@/components/home/Platform";
import { Convergence } from "@/components/home/Convergence";
import { Autonomous } from "@/components/home/Autonomous";
import { Moonshot } from "@/components/home/Moonshot";
import { Ecosystem, InstituteLogos } from "@/components/home/Ecosystem";
import { News, NextSteps } from "@/components/home/News";

const IDS = HOME_SECTIONS.map((s) => s.id);

export default function Home() {
  return (
    <>
      <ParticleLayer sectionIds={IDS} />
      <Hero /><Platform /><Convergence /><Autonomous /><Moonshot /><Ecosystem /><News />
      <InstituteLogos />
      <NextSteps />
    </>
  );
}
