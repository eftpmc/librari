import { Result } from '@/components/searchresults/columns';
import { searchNovelhall, scrapeNovelhallContent } from './sources/novelhall';

export async function fetchSearchResults(keyword?: string): Promise<Result[]> {
  if (!keyword) {
    console.warn('No keyword provided for search.');
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
    .flatMap(result => (result as PromiseFulfilledResult<Result[]>).value);
}

export async function fetchBookContent(url: string, startChapter: number, chaptersToScrape: number): Promise<any> {
  return scrapeNovelhallContent(url, startChapter, chaptersToScrape);
}