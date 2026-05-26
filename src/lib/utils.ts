import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number = import.meta.env?.DEV ? 30000 : 10000,
): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  const nativePromise = Promise.resolve(promise);

  try {
    return await Promise.race([nativePromise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

