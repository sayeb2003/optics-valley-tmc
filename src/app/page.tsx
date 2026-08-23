import { club } from "@/config/club";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { SpeechTimerRing } from "@/components/ui/SpeechTimerRing";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Stage 3 checkpoint page — verifies core components render and interact
// correctly. Replaced with the real homepage content in Stage 4.
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section tone="navy" className="pt-40 md:pt-48 pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono text-xs tracking-widest text-gold-soft uppercase mb-4">
                Stage 3 checkpoint
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-light">
                {club.tagline}
              </h1>
              <p className="mt-6 text-cream/70 text-lg max-w-md">
                {club.name} — Club #{club.clubNumber}, District {club.district}
              </p>
              <div className="flex gap-4 mt-8">
                <Button href="#visit">Join a Meeting</Button>
                <Button href="#about" variant="secondary" className="!text-cream !border-cream/30 hover:!bg-cream/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <SpeechTimerRing />
            </div>
          </div>
        </Section>

        <Section tone="cream" eyebrow="Component Check" heading="Cards & Buttons" id="about">
          <div className="grid md:grid-cols-3 gap-6">
            <Card hoverLift>
              <p className="font-display text-lg mb-2">Table Topics</p>
              <p className="text-slate text-sm">Impromptu 1–2 minute speeches on a surprise topic.</p>
            </Card>
            <Card hoverLift>
              <p className="font-display text-lg mb-2">Prepared Speeches</p>
              <p className="text-slate text-sm">Timed on the club&apos;s Green/Yellow/Red system.</p>
            </Card>
            <Card hoverLift>
              <p className="font-display text-lg mb-2">Evaluations</p>
              <p className="text-slate text-sm">Structured, supportive feedback from fellow members.</p>
            </Card>
          </div>
        </Section>

        <div id="meetings" />
        <div id="leadership" />
        <div id="visit" />
      </main>
      <Footer />
    </>
  );
}
