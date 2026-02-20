import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | number | undefined, currencyStr: string | undefined): string {
  if (!amount) return 'N/A';
  if (!currencyStr) return String(amount);

  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;

  // Try to find a 3-letter currency code (e.g. INR, USD, EUR)
  const currencyCodeMatch = currencyStr.match(/\b[A-Z]{3}\b/i);
  const currencyCode = currencyCodeMatch ? currencyCodeMatch[0].toUpperCase() : null;

  if (currencyCode && !isNaN(numericAmount as number)) {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(numericAmount as number);
    } catch (e) {
      // If Intl.NumberFormat fails (e.g. invalid currency code), fallback below
      console.warn("Invalid currency format:", e);
    }
  }

  // Fallback: Extract symbol (e.g., "₹ INR" -> "₹", "$ USD" -> "$")
  // We look for the first non-alphanumeric character that isn't a space/dot/comma
  const symbolMatch = currencyStr.match(/[^\w\s,.]/);
  // Default to the first word if no symbol is found to avoid just printing numbers when they pass "INR"
  const symbol = symbolMatch ? symbolMatch[0] : (currencyCode || currencyStr.split(' ')[0]);

  if (isNaN(numericAmount as number)) return `${symbol} ${amount}`.trim();

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(numericAmount as number);

  return `${symbol} ${formattedAmount}`.trim();
}
