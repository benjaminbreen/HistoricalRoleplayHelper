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
 * Decode any image file into an ImageBitmap.
 * Strategy:
 *  1. Try createImageBitmap directly (works for HEIC on Safari/macOS/iOS)
 *  2. Fall back to heic2any conversion (for Chrome/Firefox/etc.)
 *  3. Fall back to <img> element loading
 */
async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // First try native decoding via createImageBitmap — this handles HEIC on Apple platforms
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Native decode failed, try heic2any for HEIC files
    }
  }

  // For HEIC files that failed native decode, try heic2any
  if (isHeic(file)) {
    try {
      const heic2any = (await import('heic2any')).default;
      const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: JPEG_QUALITY });
      const blob = Array.isArray(result) ? result[0] : result;
      if (typeof createImageBitmap === 'function') {
        return await createImageBitmap(blob);
      }
      // Fall through to img element approach with converted blob
      file = new File(
        [blob],
        file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'),
        { type: 'image/jpeg' },
      );
    } catch (heicErr) {
      console.warn('heic2any conversion failed, trying img element:', heicErr instanceof Error ? heicErr.message : String(heicErr));
    }
  }

  // Final fallback: load via <img> element
  const objectUrl = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error(`Failed to decode image: ${file.name}`));
      i.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Normalizes any image file for Gemini:
 *  - HEIC/HEIF: decoded via native createImageBitmap or heic2any fallback
 *  - All formats: resized so the longest side is ≤ MAX_DIMENSION, compressed to JPEG
 * Returns { dataUrl, base64, mimeType } so callers can pass the correct type to the API.
 */
export async function normalizeImage(file: File): Promise<{ dataUrl: string; base64: string; mimeType: string }> {
  const source = await decodeImage(file);

  let width = source.width;
  let height = source.height;
  const longest = Math.max(width, height);
  if (longest > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / longest;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas 2d context');
  ctx.drawImage(source, 0, 0, width, height);

  // Clean up ImageBitmap if applicable
  if ('close' in source && typeof source.close === 'function') {
    source.close();
  }

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
