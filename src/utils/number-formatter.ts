/**
 * Format number with comma separators for thousands
 * @param value - The number to format
 * @returns Formatted number string with commas
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0';
  }

  return num.toLocaleString('en-US');
}

/**
 * Format currency with comma separators and optional currency symbol
 * @param value - The number to format
 * @param currency - Currency symbol (default: 'Rp')
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string | null | undefined, currency: string = 'Rp', showSymbol: boolean = true): string {
  if (value === null || value === undefined || value === '') {
    return showSymbol ? `${currency} 0` : '0';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return showSymbol ? `${currency} 0` : '0';
  }

  const formatted = num.toLocaleString('en-US');
  return showSymbol ? `${currency} ${formatted}` : formatted;
}

/**
 * Format large numbers with K, M, B suffixes
 * @param value - The number to format
 * @returns Formatted number string with suffix
 */
export function formatLargeNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0';
  }

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
}
