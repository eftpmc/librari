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

  console.log(searchResults)
  return searchResults;
}
