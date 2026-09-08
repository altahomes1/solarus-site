import type { ImageMetadata } from 'astro';
import galleryData from '../data/photos.json';

export interface GalleryItem {
  image: ImageMetadata;
  /** Written for screen readers — describe the actual photograph. */
  alt: string;
  caption: string;
  category: string;
  /** Wide items span two columns on large screens. */
  wide?: boolean;
}

// Pulls in every file in src/assets/gallery so photos uploaded through the
// dashboard still get Astro's build-time AVIF/WebP optimization. Referencing
// them by path (rather than a hard-coded import) is what makes that possible.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/gallery/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

function buildGallery(): GalleryItem[] {
  const items: GalleryItem[] = [];
  for (const item of galleryData.photos) {
    const found = images[item.image];
    if (!found) {
      // A missing file should drop one photo, not fail the whole build.
      console.warn(`[gallery] image not found, skipping: ${item.image}`);
      continue;
    }
    items.push({
      image: found.default,
      alt: item.alt,
      caption: item.caption,
      category: item.category,
      wide: item.wide ?? false,
    });
  }
  return items;
}

export const galleryItems: GalleryItem[] = buildGallery();

/** Categories are derived from the photos, so adding one needs no code change. */
export const galleryCategories: string[] = [
  ...new Set(galleryItems.map((item) => item.category).filter(Boolean)),
];
