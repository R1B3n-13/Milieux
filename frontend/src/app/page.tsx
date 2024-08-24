"use client"
import { useEffect, useState } from 'react';
import { CustomerReviews, Hero, PopularProducts } from '@/sections';

export default function Home() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = 1;

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/store/find/1`);
        if (response.ok) {
          const data = await response.json();
          console.log('API Response Data:', data);
          setStoreInfo(data);
        } else {
          console.error('Failed to fetch store info:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchStoreInfo();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }
  else {
    console.log(storeInfo.top_items);
    
  }
  return (
    <div>
      <section className="xl:padding-l px-[15rem] wide:padding-r padding-b">
        <Hero storeInfo={storeInfo} />
      </section>

      <section className="padding px-[15rem]">
        <PopularProducts storeInfo={storeInfo} />
      </section>

      <section className="padding px-[15rem] pb-[1rem]">
        <CustomerReviews />
      </section>
    </div>
  );
}
