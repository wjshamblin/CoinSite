/**
 * Image URL utility functions
 *
 * Handles both legacy images (stored in git as /images/{type}/{filename})
 * and new images (stored in Vercel Blob with full URLs)
 */

export type ImageType = 'coins' | 'collections';

/**
 * Resolves an image reference to a full URL
 *
 * @param imageRef - Either a filename (e.g., "coin.png") or a full URL (blob storage)
 * @param type - The image type ('coins' or 'collections')
 * @returns The full URL to the image
 */
export function getImageUrl(imageRef: string | null | undefined, type: ImageType): string {
  if (!imageRef) {
    return '/images/placeholder.png'; // fallback
  }

  // If it's already a full URL (blob storage), return as-is
  if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) {
    return imageRef;
  }

  // Otherwise, it's a legacy filename - construct the path
  return `/images/${type}/${imageRef}`;
}

/**
 * Checks if an image reference is a blob URL
 */
export function isBlobUrl(imageRef: string): boolean {
  return imageRef.startsWith('http://') || imageRef.startsWith('https://');
}

/**
 * Extracts just the filename from an image reference
 * Works for both filenames and full URLs
 */
export function getFilename(imageRef: string): string {
  if (isBlobUrl(imageRef)) {
    // Extract filename from URL
    const url = new URL(imageRef);
    const pathname = url.pathname;
    return pathname.split('/').pop() || imageRef;
  }
  return imageRef;
}
