import type { CarUpload, rawCarData } from '../pages/api/scraper';

export function convertStringToNumber(input: string): number {
  const numberPattern = /\D/g;
  const numericString = input.replace(numberPattern, '');
  return parseInt(numericString, 10);
}

function extractYear(str: string): number {
  const regex = /\b(19|20)\d{2}\b/;
  const match = str.match(regex);
  return match ? Number(match[0]) : 0;
}

function extractKilometers(str: string): number {
  const regex = /(\d{1,3}(?:\s\d{3})*)(?=\s*km)/;
  const match = str.match(regex);
  return match ? parseInt(match[0].replace(/\s/g, ''), 10) : 0;
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
  year: extractYear(carRaw.extraData),
  history: null,
  km: extractKilometers(carRaw.extraData),
  distance: convertStringToNumber(carRaw.distance),
});
