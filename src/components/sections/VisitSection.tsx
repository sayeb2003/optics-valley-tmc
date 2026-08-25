import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { club } from "@/config/club";

export function VisitSection() {
  return (
    <Section tone="navy" id="visit" eyebrow="Come See a Meeting" heading="Visit Us">
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Reveal>
          <Card className="!bg-cream/5 !border-cream/15">
            <p className="font-mono text-xs tracking-widest uppercase text-gold-soft mb-3">
              When &amp; Where
            </p>
            <p className="text-lg mb-1">{club.meeting.frequency}, {club.meeting.time}</p>
            <p className="text-cream/60 text-sm">{club.meeting.locationEn}</p>
            <p className="text-cream/60 text-sm">{club.meeting.locationDirections}</p>
          </Card>
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="!bg-cream/5 !border-cream/15">
            <p className="font-mono text-xs tracking-widest uppercase text-gold-soft mb-3">
              Guest Pricing
            </p>
            <p className="text-sm text-cream/80">Early bird: {club.guestPricing.earlyBird}</p>
            <p className="text-sm text-cream/80 mt-1">Walk-in: {club.guestPricing.walkIn}</p>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="text-center">
          <p className="text-cream/70 max-w-lg mx-auto mb-6">
            Add our WeChat and ask to join the guest group — we&apos;ll walk you through
            everything before your first visit.
          </p>
          <p className="font-mono text-sm text-gold-soft mb-8">
            WeChat: {club.contact.wechatGroup}
          </p>
          <Button href={`mailto:${club.contact.email}`} size="lg">
            Email Us to Visit
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
