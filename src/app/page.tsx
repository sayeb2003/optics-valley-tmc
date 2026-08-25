import { club } from "@/config/club";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { SpeechTimerRing } from "@/components/ui/SpeechTimerRing";
import { Button } from "@/components/ui/Button";
import { HeroContent } from "@/components/sections/HeroContent";
import { AboutSection } from "@/components/sections/AboutSection";
import { MeetingFlowSection } from "@/components/sections/MeetingFlowSection";
import { LeadershipSection } from "@/components/sections/LeadershipSection";
import { VisitSection } from "@/components/sections/VisitSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section tone="navy" className="pt-40 md:pt-48 pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <HeroContent>
              <p className="font-mono text-xs tracking-widest text-gold-soft uppercase mb-4">
                Club #{club.clubNumber} · District {club.district} · Since {club.charterDate.slice(0, 4)}
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-light">
                {club.tagline}
              </h1>
              <p className="mt-6 text-cream/70 text-lg max-w-md">
                {club.name} — an international community building public speaking
                and leadership skills, every Friday in Optics Valley.
              </p>
              <div className="flex gap-4 mt-8">
                <Button href="#visit">Join a Meeting</Button>
                <Button
                  href="#about"
                  variant="secondary"
                  className="!text-cream !border-cream/30 hover:!bg-cream/10"
                >
                  Learn More
                </Button>
              </div>
            </HeroContent>
            <div className="flex justify-center">
              <SpeechTimerRing />
            </div>
          </div>
        </Section>

        <AboutSection />
        <MeetingFlowSection />
        <LeadershipSection />
        <VisitSection />
      </main>
      <Footer />
    </>
  );
}
