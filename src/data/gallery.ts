/**
 * GALLERY.TS — metadata for every photo shown on /gallery.
 *
 * HOW TO ADD PHOTOS:
 * 1. Drop the image file into public/images/gallery/
 * 2. Add an entry below with a matching `src` path
 * 3. Write real `alt` text describing what's in the photo (accessibility +
 *    SEO both depend on this being accurate, not generic)
 *
 * Photos display in fully random order, reshuffled on every page load —
 * the order in this array doesn't matter.
 */

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  meetingDate?: string; // e.g. "2026-07-10" — optional, shown as a small caption if present
};

export const galleryPhotos: GalleryPhoto[] = [
  // Example entry once a photo is added:
  // {
  //   id: "536th-group",
  //   src: "/images/gallery/536th-group.jpg",
  //   alt: "Members and guests at the 536th regular meeting",
  //   meetingDate: "2026-07-10",
  // },
];
