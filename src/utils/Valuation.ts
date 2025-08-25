export function mapImage(propertyType: string) {
  const type = propertyType?.toLowerCase() || '';
  if (type.includes('condo')) {
    return '/images/condominium-bg.png';
  }
  if (type.includes('warehouse')) {
    return '/images/warehouse-bg.png';
  }
  if (type.includes('house')) {
    return '/images/house-and-lot-bg.png';
  }
  if (type.includes('vacant') || type.includes('land')) {
    return '/images/land-bg.png';
  }

  return '/images/condominium-bg.png';
}
export function formatPropertyType(propertyType: string) {
  return propertyType
    .replace('-', ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
}

export function formatTransactionType(transactionType: string) {
  return transactionType
    .replace('-', ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
}
