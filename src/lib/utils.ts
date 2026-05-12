import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReadingTime(text: string): number {
  if (!text) return 0;
  const wordsPerMinute = 145; // Faster pace for short-form
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round((words / wordsPerMinute) * 60));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
