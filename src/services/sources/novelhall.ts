import axios from 'axios';
import cheerio from 'cheerio';

import { Result } from '@/components/searchresults/columns';

export async function searchNovelhall(query: string): Promise<Result[]> {
  const searchUrl = `https://www.novelhall.com/index.php?s=so&module=book&keyword=${query}`;
  const response = await axios.get(searchUrl);
  const $ = cheerio.load(response.data);

  const searchResults: Result[] = [];
  $('.section3 table tbody tr').each((index, row) => {
    const title: string = $(row).find('td:nth-child(2) a').text().trim();
    const href: string | undefined = $(row).find('td:nth-child(2) a').attr('href');
    if (href) {
      searchResults.push({ title: title, url: `https://www.novelhall.com${href}`, chapters: 1000 });
    }
  });

  console.log(searchResults)
  return searchResults;
}
