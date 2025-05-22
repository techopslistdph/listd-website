import condominium from '@/../public/images/condominium-bg.png';
import warehouse from '@/../public/images/warehouse-bg.png';
import houseAndLot from '@/../public/images/house-and-lot-bg.png';
import land from '@/../public/images/land-bg.png';

export const backgroundImage = (propertyType: string) => {
  if (propertyType.toLowerCase() === 'condominium') {
    return condominium;
  }
  if (propertyType.toLowerCase() === 'warehouse') {
    return warehouse;
  }
  if (propertyType.toLowerCase() === 'house and lot') {
    return houseAndLot;
  }
  if (propertyType.toLowerCase() === 'land') {
    return land;
  }

  return condominium; // fallback
};
