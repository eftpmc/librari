import axios from 'axios';
import cheerio from 'cheerio';
import { Result } from '@/components/searchresults/columns';

export async function searchNovelbin(query: string): Promise<Result[]> {
    const searchUrl = `https://novelbin.me/ajax/search-novel?keyword=${query}`;
    // Add the headers here
    const headers = { 'User-Agent': 'Mozilla/5.0' };

    const response = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(response.data);

    const searchResults: Result[] = [];
    $('a.list-group-item').each((index, anchor) => {
        const title: string = $(anchor).attr('title')?.trim() || "";
        const href: string | undefined = $(anchor).attr('href');

        // Check the path of the URL to filter out the 'See more results' link
        if (href && !href.includes('/search')) {
            searchResults.push({ id: href, title, chapters: 1000 });
        }
    });

    return searchResults;
}