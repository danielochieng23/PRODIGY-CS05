import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold">Search Results</h1>
      {query && <p>Search query: "{query}"</p>}
      <p className="text-gray-600 mt-4">Display search results and filters.</p>
    </div>
  );
};

export default SearchResults;