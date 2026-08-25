import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { club } from "@/config/club";

const WHY_POINTS = [
  {
    title: "Practice, not performance",
    body: "Every meeting gives you real stage time — Table Topics, prepared speeches, or a speaking role — in a room built to help you improve, not judge you.",
  },
  {
    title: "Structured feedback",
    body: "Every speech gets an evaluation. Not vague praise — specific, actionable feedback from someone who watched you speak.",
  },
  {
    title: "An international community",
    body: "Optics Valley TMC brings together members from many countries and backgrounds, all working on the same skill: saying what they mean, clearly and with confidence.",
  },
];

export function AboutSection() {
  return (
    <Section tone="cream" id="about" eyebrow="About the Club" heading="Why Toastmasters">
      <Reveal>
        <p className="max-w-2xl mx-auto text-center text-slate text-lg mb-16">
          {club.mission}
        </p>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-8">
        {WHY_POINTS.map((point, i) => (
          <Reveal key={point.title} delay={i * 0.1}>
            <h3 className="font-display text-xl mb-2">{point.title}</h3>
            <p className="text-slate text-sm leading-relaxed">{point.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
