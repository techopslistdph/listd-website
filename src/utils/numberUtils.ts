export const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K';
    } else {
      return price.toString();
    }
  };