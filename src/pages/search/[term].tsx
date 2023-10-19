
// pages/search/[term].tsx
import { useRouter } from 'next/router';
import { SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';

const SearchResults = () => {
  const router = useRouter();
  const { term } = router.query; // getting search term from the route parameter

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (term) {
      // Make sure term is defined
      axios.get(`https://httpbin.org/get`)
        .then((response: { data: SetStateAction<null>; }) => {
          setData(response.data);
          setLoading(false);
        }).catch((error: any) => {
          console.error("Error fetching data: ", error);
          setLoading(false);
        });
    }
  }, [term]); // This effect should re-run if the term changes

  if (loading) return <div>Grabbing Data...</div>;

  return (
    <div>
      {/* Render your data here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SearchResults;
