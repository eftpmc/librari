import { Result } from '@/components/searchresults/columns';

import { searchNovelhall } from './sources/novelhall';
import { searchNovelbin } from './sources/novelbin';

export async function getData(keyword?: string): Promise<Result[]> {
    console.log(keyword);
  
    if (!keyword) {
      return [];
    }
  
    // Array to store all promises for the search queries
    const searchPromises: Promise<Result[]>[] = [
      searchNovelhall(keyword),
      // Add other search functions here as needed
    ];
  
    // Execute all promises
    const allResults = await Promise.all(searchPromises);
  
    // Flatten the arrays into one and return
    return allResults.flat();
  }
  