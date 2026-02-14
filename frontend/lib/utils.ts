import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | number | undefined, currencyStr: string | undefined): string {
  if (!amount) return 'N/A';
  if (!currencyStr) return String(amount);

  // Extract symbol (e.g., "₹ INR" -> "₹", "$ USD" -> "$")
  // We look for the first non-alphanumeric character that isn't a space/dot/comma
  const symbolMatch = currencyStr.match(/[^\w\s,.]/);
  const symbol = symbolMatch ? symbolMatch[0] : currencyStr.split(' ')[0];

  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;

  if (isNaN(numericAmount as number)) return `${symbol} ${amount}`.trim();

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(numericAmount as number);

  return `${symbol} ${formattedAmount}`.trim();
}
