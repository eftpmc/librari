import { Result } from '@/components/searchresults/columns';

import { searchNovelhall, scrapeNovelhallContent } from './sources/novelhall';
import { searchNovelbin } from './sources/novelbin';

export async function fetchSearchResults(keyword?: string): Promise<Result[]> {
  console.log(keyword);

  if (!keyword) {
    return [];
  }

  // Array to store all promises for the search queries
  const searchPromises: Promise<Result[]>[] = [
    searchNovelhall(keyword),
    // Add other search functions here as needed
  ];

  const allResults = await Promise.allSettled(searchPromises);
  return allResults
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<Result[]>).value)
    .flat();
}

export async function fetchBookContent(url: string, startChapter: number, chaptersToScrape: number) {
  return await scrapeNovelhallContent(url, startChapter, chaptersToScrape);
}