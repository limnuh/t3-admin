import type { NextApiRequest, NextApiResponse } from 'next';
import { type newCar, prepareNewCar, calculatePercentiles } from '../../../utils/transformers';
import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';
import { type CarUpload, scrape, type scrapeResponse } from '.';
import { type Car, type Search } from '@prisma/client';
import { diff } from 'deep-object-diff';

// TODO: pls refactor the whole file...

type carHistoryData = {
  link: string;
  title: string;
  description: string;
  image: string;
  price: number;
  inactivePrice: number;
  extraData: string;
  distance: number;
  km: number;
  year: number;
  deleted: boolean;
};

type AllScrapedData = Map<string, CarUpload[]>;

const scrapeAllRunningSeach = (searches: Search[], delay = 1000): Promise<AllScrapedData> => {
  let promiseChain: Promise<unknown> = Promise.resolve(); // Start with a resolved promise
  const results = new Map();

  searches.forEach(({ url, id }) => {
    const randomisedDelay = delay + (Math.random() - 0.5) * delay * 0.1;
    promiseChain = promiseChain
      .then(async (): Promise<CarUpload[]> => {
        const {
          data: { cars },
        } = await scrape(url);
        return cars;
      })
      .then((response) => {
        results.set(id, response);
        console.log(response.length, ' cars found ---- searchId: ', id); // TODO: log to db
        return new Promise((resolve) => setTimeout(resolve, randomisedDelay)); // Delay for the next request
      })
      .catch((error) => {
        console.error('An error occurred while fetching pages:', error);
        return new Promise((resolve) => setTimeout(resolve, randomisedDelay)); // Delay even if an error occurs
      });
  });

  return promiseChain.then(() => results); // Return all results at the end
};

const getCarDataForHistoryDiff = (car: Partial<Omit<Car, 'history'>>): Partial<carHistoryData> => ({
  link: car.link,
  title: car.title,
  description: car.description,
  image: car.image,
  price: car.price,
  inactivePrice: car.inactivePrice || 0,
  extraData: car.extraData,
  distance: car.distance,
  deleted: Boolean(car.deleted),
  km: car.km,
  year: car.year,
});

const createNewHistory = (current: Partial<carHistoryData>, past: Car) => {
  const isEqual = Object.keys(diff(getCarDataForHistoryDiff(current), getCarDataForHistoryDiff(past))).length === 0;
  if (isEqual) return past.history;
  return [
    ...past.history,
    {
      ...diff(current, getCarDataForHistoryDiff(past)),
      createdAt: new Date(),
    },
  ];
};

const seaparateScrapedCars = (
  scrapedCars: CarUpload[],
  carsFromDb: Car[],
  couldBeNewCars: Car[],
  searchId: string
): { newCars: newCar[]; needtToUpdateCars: Car[]; needToDeleteCars: Car[] } => {
  const idsFromDb = carsFromDb.map(({ id }) => id);
  const idsFromScrape = scrapedCars.map(({ id }) => id);
  const couldBeNewCarIds = couldBeNewCars.map(({ id }) => id);

  return {
    newCars: scrapedCars
      .filter(
        ({ id: scrapedId }) =>
          scrapedId &&
          typeof scrapedId === 'string' &&
          !idsFromDb.includes(scrapedId) &&
          !couldBeNewCarIds.includes(scrapedId)
      )
      .map((car) => prepareNewCar(car, searchId)),
    needtToUpdateCars: carsFromDb.filter(
      ({ id }) => id && id !== '' && (idsFromScrape.includes(id) || couldBeNewCarIds.includes(id))
    ),
    needToDeleteCars: carsFromDb.filter(({ id }) => !idsFromScrape.includes(id)),
  };
};

const store = async (req: NextApiRequest, res: NextApiResponse<scrapeResponse>): Promise<string> => {
  let resultText = '';
  try {
    const ctx = await createTRPCContext({ req, res });
    const caller = appRouter.createCaller(ctx);

    const searches = await caller.search.getRunningSearches();
    console.log(searches.length, ' searches will run ----'); // TODO: log to db
    resultText += `
    ${searches.length} search will be run`;
    const allScrapedData = await scrapeAllRunningSeach(searches);

    for await (const [searchId, scrapedCars] of allScrapedData.entries()) {
      const carsFromDb = await caller.car.getBySearcId({ searchId });
      const idsFromDb = carsFromDb.map(({ id }) => id);
      const couldBeNewCarIds = scrapedCars
        .filter(({ id: scrapedId }) => scrapedId && typeof scrapedId === 'string' && !idsFromDb.includes(scrapedId))
        .map(({ id }) => id);
      const couldBeNewCars = await caller.car.getByIds({ ids: couldBeNewCarIds });
      const { newCars, needtToUpdateCars, needToDeleteCars } = seaparateScrapedCars(
        scrapedCars,
        carsFromDb,
        couldBeNewCars,
        searchId
      );
      resultText += `
      ${searchId} Save started *** New: ${newCars.length} Update: ${needtToUpdateCars.length} Delete: ${needToDeleteCars.length} ***`;
      if (newCars?.length) {
        await caller.car.createMany({ data: newCars });
        console.log(newCars.length, ' new cars created----'); // TODO: log to db
      }
      if (needToDeleteCars?.length) {
        needToDeleteCars.map(async (car) => {
          await caller.car.update({
            ...car,
            deleted: true,
            history: createNewHistory({ ...car, deleted: true }, car),
            updatedAt: new Date(),
          });
        });
        console.log(needToDeleteCars.length, ' cars deleted----'); // TODO: log to db
      }
      if (needtToUpdateCars?.length) {
        console.log(needtToUpdateCars.length, ' cars will be updated----'); // TODO: log to db
        for await (const car of needtToUpdateCars) {
          const scrapedCar = scrapedCars.find(({ id }) => id === car.id);
          if (!scrapedCar) {
            console.error('scrapedCar missing: ', car.id);
            continue;
          }
          const scrapedCarDataToHistory = getCarDataForHistoryDiff(scrapedCar);
          await caller.car.update({
            id: car.id,
            ...scrapedCarDataToHistory,
            deleted: false,
            history: createNewHistory(scrapedCarDataToHistory, car),
            updatedAt: new Date(),
          });
        }
      }

      const aggregatedData = {
        searchId,
        count: scrapedCars.length,
        pricePercentiles: calculatePercentiles(scrapedCars.map(({ price }) => price)),
        yearPercentiles: calculatePercentiles(scrapedCars.map(({ year }) => year)),
        kmPercentiles: calculatePercentiles(scrapedCars.map(({ km }) => km)),
      };

      await caller.aggregatedSearchData.create(aggregatedData);
    }
  } catch (error) {
    console.error('An error occurred while store', error);
    return 'error';
  }
  console.log(resultText);
  return resultText;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<scrapeResponse>) => {
  if (req.method === 'GET') {
    const result = await store(req, res);
    res.status(result !== 'error' ? 200 : 500).end(result);
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
