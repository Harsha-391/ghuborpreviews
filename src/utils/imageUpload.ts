/**
 * Ghubor Image Upload — Firebase Storage drag-and-drop uploader utility.
 * Uploads to Storage under `uploads/{folder}/{timestamp}-{filename}` and returns the public download URL.
 */

import { app } from "./firebase";

export type UploadFolder = "products" | "blog" | "categories" | "hero" | "pillars" | "details";

export interface UploadProgress {
  percent: number;
  state: "running" | "paused" | "error" | "success";
  url?: string;
  error?: string;
}

/**
 * Upload a File to Firebase Storage.
 * @param file - The File object to upload
 * @param folder - The storage sub-folder
 * @param theme - "dark" | "light" — used in the file path
 * @param onProgress - callback receiving upload progress
 * @returns Promise<string> — the public download URL
 */
export async function uploadImage(
  file: File,
  folder: UploadFolder,
  theme: "dark" | "light" = "dark",
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  if (!app) {
    throw new Error("Firebase Storage is not initialized. Check your .env.local config.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are accepted.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be under 10MB.");
  }

  file = await compressForUpload(file);

  // Loaded on demand so firebase/storage never ships to public, non-admin pages.
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
  const storage = getStorage(app);

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\s+/g, "_");
  const path = `uploads/${folder}/${theme}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      // Every upload gets a unique path, so the file itself never changes.
      cacheControl: "public, max-age=31536000, immutable",
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.({
          percent,
          state: snapshot.state as "running" | "paused",
        });
      },
      (error) => {
        onProgress?.({ percent: 0, state: "error", error: error.message });
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          warmImage(url);
          onProgress?.({ percent: 100, state: "success", url });
          resolve(url);
        } catch (err: any) {
          onProgress?.({ percent: 100, state: "error", error: err.message });
          reject(err);
        }
      }
    );
  });
}

// Keep in step with images.deviceSizes and images.imageSizes in next.config.ts.
const SERVED_WIDTHS = [256, 384, 640, 828, 1080, 1440, 1920];

/**
 * Asks the image optimizer for every size of a freshly uploaded image, in the
 * background. The first request for a size is resized on the spot and takes
 * 2-4 seconds; doing that here means it is the admin's browser that waits,
 * not the first shopper to see the image. Best effort: failures are ignored.
 */
function warmImage(url: string) {
  for (const w of SERVED_WIDTHS) {
    fetch(`/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`, {
      headers: { Accept: "image/avif,image/webp,*/*" },
    }).catch(() => {});
  }
}

const MAX_EDGE = 2000; // px, longest side; the storefront never displays larger
const WEBP_QUALITY = 0.82;

/**
 * Re-encodes a JPEG/PNG/WebP as WebP at most MAX_EDGE px on its longest side,
 * in the admin's browser, before it is stored. The storefront resizes every
 * image on first request, and that takes seconds for a multi-megabyte
 * original but well under one for a file this size. Returns the original
 * untouched if it is another format, if the browser cannot encode WebP, or if
 * the result would not be smaller.
 */
async function compressForUpload(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

/**
 * Creates a local Object URL for immediate image preview before upload.
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a previously created object URL to free memory.
 */
export function revokePreviewUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
