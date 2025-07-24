export function formatPrice(value: string | number): string {
  const num = Number(value);
  if (isNaN(num)) return '0';

  const truncate = (n: number, digits: number) => {
    const factor = Math.pow(10, digits);
    return Math.floor(n * factor) / factor;
  };

  if (num >= 1_000_000_000) {
    const formatted = truncate(num / 1_000_000_000, 2);
    return `${formatted.toString().replace(/\.0+$/, '')}B`;
  }

  if (num >= 1_000_000) {
    const formatted = truncate(num / 1_000_000, 2);
    return `${formatted.toString().replace(/\.0+$/, '')}M`;
  }

  if (num >= 1_000) {
    const formatted = truncate(num / 1_000, 2);
    return `${formatted.toString().replace(/\.0+$/, '')}K`;
  }

  const formatted = truncate(num, 2);
  return formatted.toString().replace(/\.0+$/, '');
}
