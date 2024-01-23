import type { CarUpload, rawCarData } from '../pages/api/scraper';

export type newCar = {
  id: string;
  searchId: string;
  link: string;
  description: string;
  title: string;
  image: string;
  extraData: string;
  price: number;
  inactivePrice: number;
  distance: number;
  km: number;
  year: number;
  history: unknown[];
};

export function convertStringToNumber(input: string): number {
  const numberPattern = /\D/g;
  const numericString = input.replace(numberPattern, '');
  const parsedInt = parseInt(numericString, 10);
  return isNaN(parsedInt) ? 0 : parsedInt;
}

export const calculatePercentiles = (inputArray: number[]): number[] => {
  if (inputArray.length < 2) {
    return [];
  }

  const sortedArray = [...inputArray].sort((a, b) => a - b);

  const min = sortedArray.at(0) || 0;
  const avg = sortedArray.reduce((a, b) => a + b, 0) / sortedArray.length;
  const max = sortedArray.at(-1) || 0;

  const firstHalf = sortedArray.splice(0, Math.floor(sortedArray.length / 2));
  const secondHalf = sortedArray;
  const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  return [min, firstHalfAvg, avg, secondHalfAvg, max];
};

function extractYear(str: string): number {
  const regex = /\b(19|20)\d{2}\b/;
  const match = str.match(regex);
  return match && !isNaN(Number(match[0])) ? Number(match[0]) : 0;
}

function extractKilometers(str: string): number {
  const regex = /(\d{1,3}(?:\s\d{3})*)(?=\s*km)/;
  const match = str.match(regex);
  return match ? parseInt(match[0].replace(/\s/g, ''), 10) : 0;
}

export const transformCar = (carRaw: rawCarData): CarUpload => ({
  id: carRaw.id,
  searchId: carRaw.searchId,
  link: carRaw.link.split('#')[0] || '',
  title: carRaw.title,
  description: carRaw.description,
  image: carRaw.image,
  price: convertStringToNumber(carRaw.price),
  inactivePrice: convertStringToNumber(carRaw.inactivePrice),
  extraData: carRaw.extraData,
  year: extractYear(carRaw.extraData),
  km: extractKilometers(carRaw.extraData),
  deleted: false,
  distance: convertStringToNumber(carRaw.distance),
});

export const prepareNewCar = (car: CarUpload, searchId: string): newCar => ({
  id: car.id,
  searchId: searchId,
  link: car.link,
  description: car.description,
  title: car.title,
  image: car.image,
  extraData: car.extraData,
  price: car.price || 0,
  inactivePrice: car.inactivePrice || 0,
  distance: car.distance,
  km: car.km,
  year: car.year,
  history: [],
});
