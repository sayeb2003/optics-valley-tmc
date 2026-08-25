import fs from "fs";
import path from "path";
import { imageSize } from "image-size";
import captions from "@/data/gallery-captions.json";

/**
 * AUTO-DISCOVERY GALLERY SYSTEM
 *
 * To add photos: just drop image files into public/images/gallery/ and
 * rebuild (or push — Vercel rebuilds automatically). No code changes,
 * no manual list to maintain. This function reads that folder directly.
 *
 * Supported formats: .jpg, .jpeg, .png, .webp
 * NOT supported: .heic (iPhone default — convert to .jpg first), .mov/.mp4
 * (videos aren't part of this gallery).
 *
 * Captions are optional and stored separately in gallery-captions.json,
 * keyed by filename, so adding a caption later never requires touching
 * this file or any component code. Missing = no caption shown.
 */

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export type GalleryPhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  caption?: string;
};

export function getGalleryPhotos(): GalleryPhoto[] {
  if (!fs.existsSync(GALLERY_DIR)) return [];

  const files = fs
    .readdirSync(GALLERY_DIR)
    .filter((f) => SUPPORTED_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .filter((f) => !f.startsWith(".")); // skip hidden/system files (e.g. macOS ._ junk)

  const photos: GalleryPhoto[] = [];

  for (const file of files) {
    try {
      const buffer = fs.readFileSync(path.join(GALLERY_DIR, file));
      const dimensions = imageSize(buffer);
      if (!dimensions.width || !dimensions.height) continue;

      photos.push({
        id: file,
        src: `/images/gallery/${file}`,
        width: dimensions.width,
        height: dimensions.height,
        caption: (captions as Record<string, string>)[file],
      });
    } catch {
      // Skip any file that fails to read as an image rather than crashing the build
      continue;
    }
  }

  return photos;
}
