import axios from 'axios';
import cheerio from 'cheerio';

import { Result } from '@/components/searchresults/columns';

// Base URLs
const BASE_URL = 'https://www.novelhall.com';
const PROXY_BASE_URL = 'https://backend-proxy-for-librari.vercel.app/api/proxy?url=';

const extractNumber = (str: string): number | undefined => {
  const numbers = str.match(/\d+/g); // match all sequences of digits
  return numbers ? parseInt(numbers[0], 10) : undefined; // return the first one if any
};

// Function to get content through the proxy
const getViaProxy = async (url: string, responseType?: 'arraybuffer'): Promise<any> => {
  try {
    const response = await axios.get(`${PROXY_BASE_URL}${encodeURIComponent(url)}`, { responseType });
    return response.data;
  } catch (error) {
    console.error('Error fetching via proxy:', error);
    return null;
  }
};


export async function searchNovelhall(query: string): Promise<Result[]> {
  const searchUrl = `${BASE_URL}/index.php?s=so&module=book&keyword=${query}`;
  const response = await axios.get(searchUrl);
  const $ = cheerio.load(response.data);

  return $('.section3 table tbody tr').map((index, row) => {
    const title: string = $(row).find('td:nth-child(2) a').text().trim();
    const href: string | undefined = $(row).find('td:nth-child(2) a').attr('href');
    const chapters: number | undefined = extractNumber($(row).find(".chapter").text().trim());

    return href && chapters ? { title, url: `${BASE_URL}${href}`, chapters} : null;
  }).get().filter(Boolean) as Result[];
}

export async function scrapeNovelhallContent(url: string, startChapter: number, chaptersToScrape: number) {
  const $ = cheerio.load(await getViaProxy(url));
  const title: string = $('.book-info h1').text().trim();
  const imgUrl: string = $('.book-info img').attr('src') || '';
  const imgProxyUrl = `${PROXY_BASE_URL}${encodeURIComponent(imgUrl)}`;
  //const imgContent: Buffer = await getViaProxy(imgUrl, 'arraybuffer');

  const chapterLinks: string[] = $('#morelist li a')
    .slice(startChapter, startChapter + chaptersToScrape)
    .map((_, elem) => $(elem).attr('href'))
    .get()
    .filter(Boolean)
    .map(link => `${BASE_URL}${link}`);

  const chapters = await Promise.all(
    chapterLinks.map(async chapterUrl => {
      const chapter$ = cheerio.load(await getViaProxy(chapterUrl));
      return chapter$('.entry-content').html() || '';
    })
  );

  return { title, imgProxyUrl, chapters };
}