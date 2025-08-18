export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K';
  } else {
    return price.toString();
  }
};

/**
 * Calculates dynamic step value based on the maximum price range
 * @param maxPrice - The maximum price in the range
 * @returns The appropriate step value for the slider
 */
export const calculateDynamicStep = (maxPrice: number): number => {
  if (maxPrice >= 100000000) {
    // 100M+ -> 10M step
    return 10000000;
  } else if (maxPrice >= 10000000) {
    // 10M+ -> 1M step
    return 1000000;
  } else if (maxPrice >= 1000000) {
    // 1M+ -> 100K step
    return 100000;
  } else if (maxPrice >= 100000) {
    // 100K+ -> 10K step
    return 10000;
  } else if (maxPrice >= 20000) {
    // 20K+ -> 1K step
    return 1000;
  } else {
    // Below 20K -> 100 step
    return 100;
  }
};
