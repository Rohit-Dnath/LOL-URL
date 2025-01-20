import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
// console.log('DEVELOPED BY ROHIT DEBNATH WITH ❤️❤️❤️❤️x100');
export function cn(...inputs) {
  return twMerge(clsx(inputs));

}
