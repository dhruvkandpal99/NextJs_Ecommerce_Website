import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPublicIdFromUrl(url: string) {
  try {
    const parts = url.split('/');
    const lastPart = parts.pop();
    return lastPart?.split('.')[0] ?? null;
  } catch {
    return null;
  }
}

export function convertToPlainObject(doc: any):any {
  if (!doc) return null;
  
  // If it's an array, map over it
  if (Array.isArray(doc)) {
    return doc.map(convertToPlainObject);
  }

  // If it's a Mongoose document, convert to object first
  const plain = doc.toObject ? doc.toObject() : doc;

  // Manually stringify special types
  const clean: any = {};
  for (const key in plain) {
    const value = plain[key];
    
    if (key === '_id' && value) {
      clean[key] = value.toString();
    } else if (key === 'productId' && value) { // Handle references
      clean[key] = value.toString();
    } else if (value instanceof Date) {
      clean[key] = value.toISOString(); // Convert Date to String
    } else if (typeof value === 'object' && value !== null) {
       // Recursive call for nested objects (optional, but safe)
       clean[key] = JSON.parse(JSON.stringify(value));
    } else {
      clean[key] = value;
    }
  }
  return clean;
}
