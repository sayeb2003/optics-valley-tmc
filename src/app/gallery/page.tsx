import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { club } from "@/config/club";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photos from ${club.name} meetings — members and guests speaking, evaluating, and growing together every Friday in Optics Valley, Wuhan.`,
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section tone="cream" className="pt-40 md:pt-48" eyebrow="Moments from Our Meetings" heading="Gallery">
          <PhotoGrid />
        </Section>
      </main>
      <Footer />
    </>
  );
}
