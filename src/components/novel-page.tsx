"use client"

import React, { useState } from 'react';
import { SearchForm } from './search-form';
import { SearchResults } from './searchresults/component';
import { ScrapeForm } from '@/components/scrape-form'
import { IconButtonContainer, IconButton } from '@/components/icon-container'

export type DownloadInfo = {
  title: string;
  url: string;
};

export type Downloads = {
  apple?: DownloadInfo;
  mobi?: DownloadInfo;
  pdf?: DownloadInfo;
};

export default function NovelPage() {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [titleToScrape, setTitleToScrape] = useState<string | null>(null);
  const [urlToScrape, setUrlToScrape] = useState<string | null>(null);
  const [downloads, setDownloads] = useState<Downloads>({});


  return (
    <div className="container mx-auto py-10 space-y-10">
      <SearchForm keywordCallback={setKeyword} />
      <SearchResults keyword={keyword} titleCallback={setTitleToScrape} urlCallback={setUrlToScrape}/>
      <ScrapeForm titleToScrape={titleToScrape} urlToScrape={urlToScrape} downloadsCallback={setDownloads}></ScrapeForm>
      <IconButtonContainer downloadsCalldown={downloads}></IconButtonContainer>
    </div>
  );
}
