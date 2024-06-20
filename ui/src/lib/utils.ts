import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class Env {
  static get(key: string): string {
    if (import.meta.env[key] === undefined) {
      throw new Error("Missing environment variable: " + key);
    }
    return import.meta.env[key] as string;
  }
}
