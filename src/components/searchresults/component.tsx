"use client"

import axios from 'axios';
import cheerio from 'cheerio';

import React, { useState, useEffect } from 'react';
import { Result, columns } from "./columns";
import { DataTable } from "./data-table";
import { getData } from '../../services/dataFetcher';

type SearchResultsProps = {
  keyword: string | null;
};

async function searchNovelhall(query: string): Promise<Result[]> {
  const searchUrl = `https://www.novelhall.com/index.php?s=so&module=book&keyword=${query}`;

  const response = await axios.get(searchUrl);

  const $ = cheerio.load(response.data);

  const searchResults: Result[] = [];
  $('.section3 table tbody tr').each((index, row) => {
    const title: string = $(row).find('td:nth-child(2) a').text().trim();
    const href: string | undefined = $(row).find('td:nth-child(2) a').attr('href');
    if (href) {
      searchResults.push({ id: href, title, chapters: 1000 });
    }
  });

  return searchResults;
}

export function SearchResults({ keyword }: SearchResultsProps) {
  const [data, setData] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (keyword) {
      getData(keyword)
        .then(responseData => {
          setData(responseData);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    }
  }, [keyword]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}