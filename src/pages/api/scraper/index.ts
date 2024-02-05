import { type Car } from '@prisma/client';
import axios, { type AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import scrapeIt from 'scrape-it';
import { convertStringToNumber, transformCar } from '../../../utils/transformers';

export type scrapeResponse = {
  error?: unknown;
  success?: boolean;
  data: {
    cars: CarUpload[];
    totalCount: number;
  };
};

export type rawCarData = {
  id: string;
  searchId: string;
  link: string;
  title: string;
  description: string;
  image: string;
  price: string;
  inactivePrice: string;
  extraData: string;
  distance: string;
};

export type History = {
  link?: string;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  inactivePrice?: number;
  extraData?: string;
  distance?: number;
  km?: number;
  year?: number;
  deleted?: boolean;
  createdAt: Date;
};

export type CarUpload = {
  id: string;
  searchId?: string;
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
  history: History[];
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type RawScrapedData = { cars: rawCarData[]; totalCount: string };

const carsPerPage = 100;
const delayBetweenPages = 10000;

const getHtml = (url: string): Promise<AxiosResponse<string>> => {
  const telepules_id_user_uj =
    'a043250a47b3d06c37b4419698056714e39da7c0578d481f130b488963594258a%3A2%3A%7Bi%3A0%3Bs%3A20%3A%22telepules_id_user_uj%22%3Bi%3A1%3Bs%3A4%3A%221449%22%3B%7D';
  const cookie = 'telepules_id_user_uj=' + telepules_id_user_uj + ';';

  return axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      Cookie: cookie,
    },
  });
};

const getDataFromHtml = (html: string): RawScrapedData => {
  const $ = cheerio.load(html);
  return scrapeIt.scrapeHTML($, {
    totalCount: '.total-count',
    cars: {
      listItem: '.row.talalati-sor',
      data: {
        id: {
          selector: '.cim-kontener h3 a',
          attr: 'href',
          convert: function (s: string) {
            const url = new URL(s);
            return url.pathname.split('-').pop();
          },
        },
        link: {
          selector: '.cim-kontener h3 a',
          attr: 'href',
        },
        title: '.cim-kontener h3 a',
        description: '.talalatisor-infokontener .hidden-xs',
        image: {
          selector: '.talalatisor-kep img',
          attr: 'src',
        },
        price:
          ':not(.hidden-md) .price-fields-desktop .pricefield-primary, :not(.hidden-md) .price-fields-desktop .pricefield-primary-highlighted',
        inactivePrice: ':not(.hidden-md) .price-fields-desktop .pricefield-inactive',
        extraData: '.talalatisor-info.adatok .info',
        distance: '.tavolsag_talalati .tavolsag_talalati',
      },
    },
  });
};

export const scrape = async (url: string): Promise<scrapeResponse> => {
  const resposne: scrapeResponse = {
    success: false,
    data: {
      cars: [],
      totalCount: 0,
    },
  };
  try {
    const resp = await getHtml(url);
    const page = getDataFromHtml(resp.data);
    const carsNumberOnPage = page?.cars.length;
    const totalCount = convertStringToNumber(page.totalCount);

    if (carsNumberOnPage) {
      resposne.data = {
        cars: page?.cars.map(transformCar),
        totalCount,
      };
      resposne.success = true;
    }
    if (carsPerPage < totalCount) {
      const pagesLeft = Math.floor((totalCount - 1) / carsPerPage);
      const pagedUrls = Array.from({ length: pagesLeft }, (_, i) => `${url}/page${i + 2}`);
      const carsFromOtherPages = await fetchWithDelay(pagedUrls, delayBetweenPages);
      resposne.data.cars = resposne.data.cars.concat(carsFromOtherPages.map(transformCar));
    }
  } catch (error) {
    resposne.error = error;
  }
  return resposne;
};

function fetchWithDelay(urls: string[], delay = 1000): Promise<rawCarData[]> {
  let promiseChain: Promise<unknown> = Promise.resolve(); // Start with a resolved promise
  let results: rawCarData[] = [];

  urls.forEach((url, index) => {
    const randomisedDelay = delay + (Math.random() - 0.5) * delay * 0.1;
    promiseChain = promiseChain
      .then(async (): Promise<rawCarData[]> => {
        const pagedUrl = `${url}/page${index + 2}`;
        const resp = await getHtml(pagedUrl);
        const page = getDataFromHtml(resp.data);
        return page.cars;
      })
      .then((response) => {
        results = results.concat(response);
        return new Promise((resolve) => setTimeout(resolve, randomisedDelay)); // Delay for the next request
      })
      .catch((error) => {
        console.error('An error occurred while fetching pages:', error);
        return new Promise((resolve) => setTimeout(resolve, randomisedDelay)); // Delay even if an error occurs
      });
  });

  return promiseChain.then(() => results); // Return all results at the end
}

const handler = async (req: NextApiRequest, res: NextApiResponse<scrapeResponse>) => {
  if (req.method === 'GET') {
    const url = String(req.query.url);
    const result = await scrape(url);
    res.status(result.success ? 200 : 500).json(result);
    return;
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
