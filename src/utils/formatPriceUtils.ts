export function formatPrice(value: string | number): string {
    const num = Number(value);
    if (isNaN(num)) return '0';
  
    if (num >= 1_000_000) {
      const formatted = (num / 1_000_000).toFixed(2);
      return `${formatted.replace(/\.?0+$/, '')}M`;
    }
    if (num >= 1_000) {
      const formatted = (num / 1_000).toFixed(2);
      return `${formatted.replace(/\.?0+$/, '')}K`;
    }
    return num.toFixed(2).replace(/\.?0+$/, '');
  }