import { ParticleLayer } from "@/components/three/ParticleLayer";

const IDS = ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"] as const;

export default function Home() {
  return (
    <>
      <ParticleLayer sectionIds={IDS} />
      {IDS.map((id) => (
        <section key={id} id={id} className="relative z-10 flex min-h-[140vh] items-start px-8 pt-32">
          <h2 className="text-3xl font-semibold">{id}</h2>
        </section>
      ))}
    </>
  );
}
