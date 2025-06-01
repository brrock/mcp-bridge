<<<<<<< HEAD
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
=======
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
