'use client'

import React, {useState, useEffect, useRef} from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { searchProducts } from '@/actions/search'
import { Product } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'

const SearchContainer = () => {
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<Product[]>([]);
    const searchContainerRef = useRef<HTMLDivElement>(null);


    useEffect(()=>{
        getSearchHistory();

        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);;


    useEffect(()=>{
        search();
    }, [searchQuery]);;

    const getSearchHistory = () => {
        const localSearchHistory = localStorage.getItem('searchHistory');
        if (localSearchHistory) {
          setSearchHistory(JSON.parse(localSearchHistory)); // Parse JSON string back to array
        }
    };

    const addSearchHistory = (search: string) => {
        if (!search) return;
        const filteredHistory = searchHistory.filter((item) => item.toLowerCase() !== search.toLowerCase());
        const updatedHistory = [search, ...filteredHistory].slice(0, 10);
        
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      };
      

    const search = async () => {
        if (!searchQuery) return; // Avoid searching empty queries
        try {
          const results = await searchProducts(searchQuery); // Call your searchProducts function
          setSearchResult(results)
        } catch (error) {
          console.error('Error during search:', error);
        }
    };

    const onResultClick=(resultIndex:number)=>{
        const product=searchResult[resultIndex]
        addSearchHistory(product.productName)
        setSearchQuery('')
        setIsSearchOpen(false)
        redirect(`/search?query=${product.productName}`)
    }

    const searchHistoryClick=(historyIndex:number)=>{
        setSearchQuery(searchHistory[historyIndex])
    }

    return (
      <div
        className={`relative flex justify-end transition-all duration-300 ${
          isSearchOpen ? "w-2xl" : "w-auto"
        }`}
        ref={searchContainerRef}
      >
        {!isSearchOpen && (
          <button
            className="flex gap-2 items-center border border-[#DDDDDD] rounded-lg placeholder:text-[#666666] px-3 py-1"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4 text-[#666666]" />
            <h4>Search for products</h4>
          </button>
        )}

        {/* Input Field (Expands on Click) */}
        {isSearchOpen && (
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search for product"
              className="pl-10 border-none rounded-md placeholder:text-[#666666] shadow-lg transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            <div className="w-full bg-background shadow-lg absolute rounded-lg border-2 border-black dark:border-white">
              {searchResult.length > 0 ? (
                <>
                  {searchResult.map(({ productName }, index: number) => (
                    <div
                      className="border-b w-full hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer p-2"
                      key={index}
                      onClick={() => {
                        onResultClick(index);
                      }}
                    >
                      {productName}{" "}
                      <span style={{ fontSize: "9px", textAlign: "right" }}>
                        Search Results
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {searchHistory.map((search: string, index: number) => (
                    <div
                      className="border-b w-full hover:bg-slate-100 dark:hover:bg-[#ffffff5d] cursor-pointer p-2"
                      key={index}
                      onClick={() => searchHistoryClick(index)}
                    >
                      {search}{" "}
                      <span style={{ fontSize: "9px", textAlign: "right" }}>
                        Search History
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
}

export default SearchContainer