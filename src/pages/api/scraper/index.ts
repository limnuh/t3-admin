import { type Car } from '@prisma/client';
import axios from 'axios';
import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import scrapeIt from 'scrape-it';

type scrapeResponse = {
  error?: unknown;
  success?: boolean;
  data?: CarUpload[];
};

export type rawCarData = {
  id: string;
  link: string;
  title: string;
  description: string;
  image: string;
  price: string;
  inactivePrice: string;
  extraData: string;
  distance: string;
};

export type CarUpload = Partial<Pick<Car, 'id' | 'createdAt' | 'updatedAt'>> &
  Omit<Car, 'id' | 'createdAt' | 'updatedAt'>;

function convertStringToNumber(input: string): number {
  const numberPattern = /\D/g;
  const numericString = input.replace(numberPattern, '');
  return parseInt(numericString, 10);
}

const transformCar = (carRaw: rawCarData): CarUpload => ({
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

export const scrape = async (url: string): Promise<scrapeResponse> => {
  const telepules_id_user_uj =
    'a043250a47b3d06c37b4419698056714e39da7c0578d481f130b488963594258a%3A2%3A%7Bi%3A0%3Bs%3A20%3A%22telepules_id_user_uj%22%3Bi%3A1%3Bs%3A4%3A%221449%22%3B%7D';

  const cookie = 'telepules_id_user_uj=' + telepules_id_user_uj + ';';
  const resposne: scrapeResponse = {
    success: false,
    data: [],
  };
  try {
    const resp = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
        Cookie: cookie,
      },
    });
    const $ = cheerio.load(resp.data as string);
    const page: { cars: rawCarData[] } = scrapeIt.scrapeHTML($, {
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

    if (page?.cars.length) {
      resposne.data = page?.cars.map(transformCar);
    }
    resposne.success = true;
  } catch (error) {
    resposne.error = error;
  }
  return resposne;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<scrapeResponse>) => {
  if (req.method === 'GET') {
    const url = String(req.query.url);
    const { error, data, success } = await scrape(url);
    if (!success) return res.status(500).json({ error });
    res.status(200).json(data as object);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
