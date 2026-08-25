"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/lib/gallery";
import { Lightbox } from "@/components/gallery/Lightbox";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type PhotoGridProps = {
  photos: GalleryPhoto[]; // server-discovered, passed in as a prop
};

export function PhotoGrid({ photos: initialPhotos }: PhotoGridProps) {
  // Reshuffle client-side on every load. Starts with the server-given
  // order to avoid a hydration mismatch, then randomizes right after mount.
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);

  useEffect(() => {
    setPhotos(shuffle(initialPhotos));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (initialPhotos.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-2xl text-slate mb-2">
          Photos from our meetings will start appearing here soon.
        </p>
        <p className="text-slate/70 text-sm">Check back after our next Friday meeting.</p>
      </div>
    );
  }

  return (
    <>
      {/* CSS multi-column masonry — each photo keeps its own natural aspect
          ratio (no crop, no forced uniform box) via explicit width/height
          passed to next/image, which reserves the correct space and avoids
          layout shift while images load. */}
      <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(i)}
            className="relative block w-full mb-3 rounded-[var(--radius-md)] overflow-hidden break-inside-avoid group"
          >
            <Image
              src={photo.src}
              alt={photo.caption || "Photo from an Optics Valley Toastmasters meeting"}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
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
