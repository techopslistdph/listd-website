import { PropertyDetail, PropertyImage } from '../queries/server/propety/type';

export const filterProperties = (properties: PropertyDetail[]) => {
  return properties.filter((property: PropertyDetail) => {
    // Check if property has images
    if (property?.property?.images?.length === 0) {
      return false;
    }

    // Check if ALL images have valid HTTP/HTTPS URLs
    const allImagesValid = property?.property?.images.every(
      (image: PropertyImage) => {
        const imageUrl = image?.imageUrl;
        return (
          imageUrl &&
          (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
        );
      }
    );

    return allImagesValid;
  });
};
