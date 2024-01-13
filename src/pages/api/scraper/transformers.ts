import type { CarUpload, rawCarData } from '.';

export function convertStringToNumber(input: string): number {
  const numberPattern = /\D/g;
  const numericString = input.replace(numberPattern, '');
  return parseInt(numericString, 10);
}

export const transformCar = (carRaw: rawCarData): CarUpload => ({
  id: carRaw.id,
  link: carRaw.link,
  title: carRaw.title,
  description: carRaw.description,
  image: carRaw.image,
  price: convertStringToNumber(carRaw.price),
  inactivePrice: convertStringToNumber(carRaw.inactivePrice),
  extraData: carRaw.extraData,
  distance: convertStringToNumber(carRaw.distance),
});
