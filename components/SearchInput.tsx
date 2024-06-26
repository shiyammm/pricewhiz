'use client';
import React, { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrapeAndStoreAmazonProduct } from '@/lib/action';
import { useRouter } from 'next/navigation';

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const isValid = (url: string) => {
    try {
      const paseUrl = new URL(url);
      const hostname = paseUrl.hostname;

      if (hostname.includes('amazon.com') || hostname.includes('amazon'))
        return true;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidAmazonProductUrl = isValid(searchInput);

    if (!isValidAmazonProductUrl) {
      alert('Please enter valid Amazon Product url');
    }
    try {
      setIsSearching(true);
      setSearchInput('');
      const product = await ScrapeAndStoreAmazonProduct(searchInput);
      if (product && product._id) {
        router.push(`/products/${product._id}`);
      } else {
        alert('Failed to scrape and store product');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      className="flex max-w-lg items-center space-x-2 mt-8 w-full"
      onSubmit={handleSubmit}
    >
      <Input
        type="search"
        placeholder="Paste your amazon product url"
        className="text-md max-w-lg"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Button
        type="submit"
        className="py-5 px-2 md:px-4 text-md"
        disabled={searchInput === ''}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
};

export default SearchInput;
