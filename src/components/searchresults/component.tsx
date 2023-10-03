"use client"

import React, { useState, useEffect } from 'react';
import { Result, columns } from "./columns";
import { DataTable } from "./data-table";

type SearchResultsProps = {
  keyword: string | null;
};

async function getData(keyword?: string): Promise<Result[]> {
  // Fetch data from your API here.
  console.log(keyword)
  return [
    {
      id: "32022sword-god-in-a-world-of-magic-27144",
      title: "Sword God in a World of Magic",
      chapters: 1024,
    },
    {
      id: "333shadow-slave2022-26842",
      title: "Shadow Slave",
      chapters: 1181,
    },
  ];
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