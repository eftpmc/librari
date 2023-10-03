"use client"

import React, { useState } from 'react';
import { SearchForm } from './searchform'; // Update with your file path
import { SearchResults } from './searchresults/component'; // Update with your file path

export default function SearchPage() {
  const [keyword, setKeyword] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-10">
      <SearchForm onSearch={setKeyword} />
      <SearchResults keyword={keyword} />
    </div>
  );
}
