import axios from 'axios';
import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import scrapeIt from 'scrape-it';

type scrapeResponse = {
  error?: unknown;
  success?: boolean;
  data?: unknown;
};

export const scrape = async (url: string): Promise<scrapeResponse> => {
  const telepules_id_user_uj =
    'a043250a47b3d06c37b4419698056714e39da7c0578d481f130b488963594258a%3A2%3A%7Bi%3A0%3Bs%3A20%3A%22telepules_id_user_uj%22%3Bi%3A1%3Bs%3A4%3A%221449%22%3B%7D';

  const cookie = 'telepules_id_user_uj=' + telepules_id_user_uj + ';';
  const resposne: scrapeResponse = {
    success: false,
    data: '',
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
    const page = scrapeIt.scrapeHTML($, {
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
          price: '.price-fields-desktop .pricefield-primary',
          extraData: '.talalatisor-info.adatok .info',
          distance: '.tavolsag_talalati .tavolsag_talalati',
        },
      },
    });
    resposne.data = page;
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
