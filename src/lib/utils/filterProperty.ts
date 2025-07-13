import { PropertyDetail, PropertyImage } from '../queries/server/propety/type';

export const filterProperties = (properties: PropertyDetail[]) => {
  return properties?.filter(property => {
    // Check if property has images
    if (!property?.property?.images?.length) {
      // Generate a temporary SVG image if no images are present
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='#e9e9e9'/><text x='50%' y='50%' fill='#555' dy='.3em' text-anchor='middle' font-family='sans-serif' font-size='24'>Temporary Image</text></svg>`;
      const imageUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
      property.property.images = [
        {
          id: 'temp-image',
          imageUrl: imageUrl,
        },
      ];
    }

    // Check if ALL images have valid HTTP/HTTPS URLs or are data URIs
    const allImagesValid = property?.property?.images?.every(
      (image: PropertyImage) => {
        const imageUrl = image?.imageUrl;
        return (
          imageUrl &&
          (imageUrl.startsWith('http://') ||
            imageUrl.startsWith('https://') ||
            imageUrl.startsWith('data:image'))
        );
      },
    );

    return allImagesValid;
  });
};
