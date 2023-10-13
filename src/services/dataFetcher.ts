import stringSimilarity from 'string-similarity';

import { Result } from '@/components/searchresults/columns';
import { searchNovelhall, scrapeNovelhallContent } from './sources/novelhall';

type ScraperFunction = (url: string, startChapter: number, chaptersToScrape: number) => Promise<{
  title: string;
  imgProxyUrl: string;
  chapters: string[];
}>;

const SCRAPER_MAP: { [domain: string]: ScraperFunction } = {
  'novelhall.com': scrapeNovelhallContent,
  // ... other domains and their scraper functions
};

export async function fetchSearchResults(keyword?: string): Promise<Result[]> {
  if (!keyword) {
    console.warn('No keyword provided for search.');
    return [];
  }

  // Array to store all promises for the search queries
  const searchPromises: Promise<Result[]>[] = [
    searchNovelhall(keyword),
    // Add other search functions here as needed
    // searchOtherSource(keyword),
  ];

  const allResults = await Promise.allSettled(searchPromises);

  const results = allResults
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => (result as PromiseFulfilledResult<Result[]>).value);

  results.sort((a, b) => {
    const similarityA = stringSimilarity.compareTwoStrings(keyword, a.title);
    const similarityB = stringSimilarity.compareTwoStrings(keyword, b.title);
    return similarityB - similarityA; // sort in descending order of similarity
  });

  return results;
}

export async function fetchBookContent(url: string, startChapter: number, chaptersToScrape: number): Promise<any> {
  const domain = new URL(url).hostname;
  const scraperFunction = SCRAPER_MAP[domain];

  if (!scraperFunction) {
    throw new Error(`No scraper found for domain: ${domain}`);
  }

  return scraperFunction(url, startChapter, chaptersToScrape);
}
