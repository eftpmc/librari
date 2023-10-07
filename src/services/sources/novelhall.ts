import axios from 'axios';
import cheerio from 'cheerio';

import { Result } from '@/components/searchresults/columns';

const extractNumber = (str: string) => {
  const numbers = str.match(/\d+/g);  // match all sequences of digits
  return numbers ? parseInt(numbers[0], 10) : undefined;  // return the first one if any
}

export async function searchNovelhall(query: string): Promise<Result[]> {
  const searchUrl = `https://www.novelhall.com/index.php?s=so&module=book&keyword=${query}`;
  const response = await axios.get(searchUrl);
  const $ = cheerio.load(response.data);

  const searchResults: Result[] = [];
  $('.section3 table tbody tr').each((index, row) => {
    const title: string = $(row).find('td:nth-child(2) a').text().trim();
    const href: string | undefined = $(row).find('td:nth-child(2) a').attr('href');
    const chapters: number | undefined = extractNumber($(row).find(".chapter").text().trim());
    if (href && chapters) {
      searchResults.push({ title, url: `https://www.novelhall.com${href}`, chapters});
    }
  });

  return searchResults;
}

export async function scrapeNovelhallContent(url: string, startChapter: number, chaptersToScrape: number) {
  const proxyBaseUrl = "https://backend-proxy-for-librari.vercel.app/api/proxy?url=";

  // Use proxy for initial URL
  const response = await axios.get(`${proxyBaseUrl}${encodeURIComponent(url)}`);
  const $ = cheerio.load(response.data);

  const title: string = $('.book-info h1').text().trim();
  const imgUrl: string = $('.book-img img').attr('src') || '';

  // Use proxy for image URL
  const imgProxyUrl = `${proxyBaseUrl}${encodeURIComponent(imgUrl)}`
  const imgResponse = await axios.get(`${proxyBaseUrl}${encodeURIComponent(imgUrl)}`, { responseType: 'arraybuffer' });
  const imgContent: Buffer = imgResponse.data;

  const chapterLinks: string[] = [];
  $('#morelist li a').slice(startChapter, startChapter + chaptersToScrape).each((_, elem) => {
    const link = $(elem).attr('href');
    if (link) {
      chapterLinks.push(`https://www.novelhall.com${link}`);
    }
  });

  const chapters: string[] = [];
  for (const chapterUrl of chapterLinks) {
    // Use proxy for chapter URLs
    const chapterResponse = await axios.get(`${proxyBaseUrl}${encodeURIComponent(chapterUrl)}`);
    const chapter$ = cheerio.load(chapterResponse.data);
    const chapterText: string = chapter$('.entry-content').html() || '';
    chapters.push(chapterText);
  }

  return { title, imgProxyUrl, chapters };
}

