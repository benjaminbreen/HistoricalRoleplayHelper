/**
 * Image utility functions for character sheet processing.
 */

const HEIC_EXTENSIONS = ['.heic', '.heif'];
const MAX_DIMENSION = 1536; // px – good for Gemini to read handwriting without bloating payload
const JPEG_QUALITY = 0.85;

/** Returns true if a file looks like HEIC/HEIF (by type or extension). */
function isHeic(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type === 'image/heic' || type === 'image/heif') return true;
  // Browsers sometimes leave MIME blank for HEIC — fall back to extension
  const name = file.name.toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => name.endsWith(ext));
}

/**
 * Normalizes any image file for Gemini:
 *  - HEIC/HEIF: sent as raw base64 (Gemini supports HEIC natively)
 *  - Other formats: resized so the longest side is ≤ MAX_DIMENSION, compressed to JPEG
 * Returns { dataUrl, base64, mimeType } so callers can pass the correct type to the API.
 */
export async function normalizeImage(file: File): Promise<{ dataUrl: string; base64: string; mimeType: string }> {
  // HEIC files: read as-is and let Gemini handle them directly.
  // This avoids heic2any's fragile Web Worker which breaks in many bundler contexts.
  if (isHeic(file)) {
    const dataUrl = await fileToDataUrl(file);
    const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
    return { dataUrl, base64, mimeType: 'image/heic' };
  }

  // Non-HEIC: load, resize, compress to JPEG
  const objectUrl = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('Failed to decode image'));
    i.src = objectUrl;
  });
  URL.revokeObjectURL(objectUrl);

  let { width, height } = img;
  const longest = Math.max(width, height);
  if (longest > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / longest;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);

  return { dataUrl, base64, mimeType: 'image/jpeg' };
}

/** Reads a File into a data URL string. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/** Strips the `data:...;base64,` prefix from a data URL, returning raw base64. */
export function dataUrlToBase64(dataUrl: string): string {
  const idx = dataUrl.indexOf(',');
  return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
}

/**
 * Crops a portrait region from a full image data URL using an offscreen canvas.
 * Returns a 200x200 JPEG data URL at 0.85 quality.
 * Falls back to center-crop if bounds are zero or invalid.
 */
export function cropPortrait(
  fullImageDataUrl: string,
  bounds: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      let sx = bounds.x;
      let sy = bounds.y;
      let sw = bounds.width;
      let sh = bounds.height;

      // Fall back to center-crop if bounds are invalid
      if (sw <= 0 || sh <= 0 || sx < 0 || sy < 0 || sx + sw > img.width || sy + sh > img.height) {
        const side = Math.min(img.width, img.height);
        sx = (img.width - side) / 2;
        sy = (img.height - side) / 2;
        sw = side;
        sh = side;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 200, 200);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('Failed to load image for cropping'));
    img.src = fullImageDataUrl;
  });
}
