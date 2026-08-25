import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { executiveTeam, pastLeaders } from "@/config/club";

export function LeadershipSection() {
  return (
    <Section tone="cream" id="leadership" eyebrow="Club Executive Committee" heading="Leadership">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {executiveTeam.map((member, i) => (
          <Reveal key={`${member.name}-${member.role}`} delay={(i % 3) * 0.08}>
            <Card hoverLift>
              <p className="font-display text-lg">{member.name}</p>
              <p className="text-gold text-xs font-mono uppercase tracking-wide mt-1">
                {member.role}
              </p>
              {member.bio && <p className="text-slate text-sm mt-3">{member.bio}</p>}
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-16 text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-slate mb-4">
            Past Leadership
          </p>
          <p className="text-slate text-sm max-w-2xl mx-auto leading-relaxed">
            {pastLeaders.map((leader, i) => (
              <span key={`${leader.name}-${leader.role}`}>
                <span className="text-ink">{leader.name}</span> ({leader.role})
                {leader.note && <span className="text-slate/70"> — {leader.note}</span>}
                {i < pastLeaders.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
