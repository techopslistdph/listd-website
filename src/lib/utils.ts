import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(text?: string | null, fallback?: string, maxInitials: number = 2): string {
  if (text) {
    return text
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, maxInitials);
  }
  
  return fallback?.charAt(0).toUpperCase() || 'U';
}


export function toTitleCase(text?: string | null, separator: string = ' '): string {
  if (!text) return '';
  
  return text
    .split(separator)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(separator);
}
