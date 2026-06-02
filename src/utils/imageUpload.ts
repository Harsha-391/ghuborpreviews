/**
 * Ghubor Image Upload — Firebase Storage drag-and-drop uploader utility.
 * Uploads to Storage under `uploads/{folder}/{timestamp}-{filename}` and returns the public download URL.
 */

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

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
export function uploadImage(
  file: File,
  folder: UploadFolder,
  theme: "dark" | "light" = "dark",
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!storage) {
      reject(new Error("Firebase Storage is not initialized. Check your .env.local config."));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Only image files are accepted."));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("Image must be under 10MB."));
      return;
    }

    const ext = file.name.split(".").pop() || "jpg";
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\s+/g, "_");
    const path = `uploads/${folder}/${theme}/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
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
