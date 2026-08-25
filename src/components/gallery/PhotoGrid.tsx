"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { galleryPhotos, type GalleryPhoto } from "@/data/gallery";
import { Lightbox } from "@/components/gallery/Lightbox";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Cycle of row-spans so the grid reads as a magazine layout, not a rigid
// uniform wall of thumbnails.
const SPAN_CYCLE = ["row-span-1", "row-span-2", "row-span-1", "row-span-1", "row-span-2"];

export function PhotoGrid() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Reshuffle on every page load — client-side only, so this never mismatches
  // between server and client render.
  useEffect(() => {
    setPhotos(shuffle(galleryPhotos));
  }, []);

  if (galleryPhotos.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-2xl text-slate mb-2">
          Photos from our meetings will start appearing here soon.
        </p>
        <p className="text-slate/70 text-sm">
          Check back after our next Friday meeting.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[220px] gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(i)}
            className={`relative rounded-[var(--radius-md)] overflow-hidden group ${SPAN_CYCLE[i % SPAN_CYCLE.length]}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      <Lightbox
        photos={photos}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
