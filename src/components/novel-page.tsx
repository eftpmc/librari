"use client"

import React, { useState } from 'react';
import { SearchForm } from './search-form';
import { SearchResults } from './searchresults/component';
import { ScrapeForm } from '@/components/scrape-form'

export default function NovelPage() {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [titleToScrape, setTitleToScrape] = useState<string | null>(null);
  const [urlToScrape, setUrlToScrape] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);


  return (
    <div className="container mx-auto py-10">
      <SearchForm keywordCallback={setKeyword} />
      <SearchResults keyword={keyword} />
      <ScrapeForm titleToScrape={titleToScrape} urlToScrape={urlToScrape}></ScrapeForm>
    </div>
  );
}
