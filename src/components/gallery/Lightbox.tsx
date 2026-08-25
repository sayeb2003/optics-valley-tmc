"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useCallback } from "react";
import type { GalleryPhoto } from "@/lib/gallery";

type LightboxProps = {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ photos, activeIndex, onClose, onNavigate }: LightboxProps) {
  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex + 1) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex - 1 + photos.length) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, onClose, goNext, goPrev]);

  const photo = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-navy-deep/95 flex items-center justify-center px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption || "Meeting photo"}
        >
          <button
            className="absolute top-6 right-6 text-cream/80 hover:text-cream p-2"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 text-cream/80 hover:text-cream p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 md:right-8 text-cream/80 hover:text-cream p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next photo"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.src}
              alt={photo.caption || "Photo from an Optics Valley Toastmasters meeting"}
              width={photo.width}
              height={photo.height}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-[var(--radius-sm)]"
              sizes="90vw"
              priority
            />
            {photo.caption && (
              <p className="text-cream/70 text-sm text-center max-w-lg">{photo.caption}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
