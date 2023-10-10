// External imports
import React, { useState, useEffect } from 'react';

// Local imports
import { Result, columns } from "./columns";
import { DataTable } from "./data-table";
import { fetchSearchResults } from '@/services/dataFetcher';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Types
type SearchResultsProps = {
  keyword: string | null;
  titleCallback: (title: string) => void;
  urlCallback: (url: string) => void;
};

export function SearchResults({ keyword, titleCallback, urlCallback }: SearchResultsProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  useEffect(() => {
    if (keyword) {
      fetchSearchResults(keyword)
        .then(responseData => {
          setResults(responseData);
          setIsLoading(false);
        })
        .catch(err => {
          setFetchError(err);
          setIsLoading(false);
        });
    }
  }, [keyword]);

  // Styled loading state
  if (isLoading) return (
    <div className="flex justify-center items-center py-6 text-lg font-semibold text-gray-600">
      No Data
    </div>
  );

  // Styled error state
  if (fetchError) return (
    <div className="flex justify-center items-center py-6 text-lg font-semibold text-red-600">
      Error: {fetchError.message}
    </div>
  );

  // Data display
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>2. Select a Book</CardTitle>
        <CardDescription>Select the book you would like.</CardDescription>
      </CardHeader>
      <CardContent className="flex space-x-4">
        <DataTable columns={columns} data={results}
          titleCallback={(title: string) => {
            titleCallback(title);
          }}
          urlCallback={(url: string) => {
            urlCallback(url);
          }} />
      </CardContent>
    </Card>

  );
}