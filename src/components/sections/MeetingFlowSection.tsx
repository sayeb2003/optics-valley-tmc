import { Section } from "@/components/layout/Section";
import { meetingFlow } from "@/config/club";

export function MeetingFlowSection() {
  return (
    <Section
      tone="navy"
      id="meetings"
      eyebrow="Every Friday, 7:00–9:30 PM"
      heading="What Happens at a Meeting"
    >
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
        {meetingFlow.map((step, i) => (
          <div key={step.phase} className="flex gap-4">
            <span className="font-mono text-sm text-gold-soft mt-1 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-lg mb-1">{step.phase}</h3>
              <p className="text-cream/60 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-cream/40 text-xs font-mono mt-14">
        Some Fridays run a &ldquo;Speech Marathon&rdquo; — four prepared speeches instead of
        two, and no workshop.
      </p>
    </Section>
  );
}
