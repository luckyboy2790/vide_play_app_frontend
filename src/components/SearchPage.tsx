
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SearchHeader from './SearchHeader';
import SearchBySection from './SearchBySection';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col justify-center items-center px-4 overflow-hidden relative">
      {/* Football diagram background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal chalk lines */}
        <div className="absolute top-1/4 left-1/4 w-32 h-0.5 bg-white opacity-40 transform rotate-45"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-0.5 bg-white opacity-40 transform -rotate-45"></div>
        
        {/* Arrows pointing to search elements */}
        <div className="absolute top-1/3 left-8">
          <div className="w-16 h-0.5 bg-white opacity-50"></div>
          <div className="absolute right-0 top-0 w-2 h-2 border-r-2 border-t-2 border-white opacity-50 transform rotate-45 -translate-y-1"></div>
        </div>
        
        <div className="absolute bottom-1/3 right-8">
          <div className="w-20 h-0.5 bg-white opacity-50"></div>
          <div className="absolute left-0 top-0 w-2 h-2 border-l-2 border-t-2 border-white opacity-50 transform -rotate-45 -translate-y-1"></div>
        </div>
        
        {/* X marks */}
        <div className="absolute top-1/5 right-1/3 text-white opacity-30 text-2xl font-bold transform rotate-12">×</div>
        <div className="absolute bottom-1/4 left-1/5 text-white opacity-30 text-xl font-bold transform -rotate-12">×</div>
        
        {/* Circle formations */}
        <div className="absolute top-1/6 left-1/2 w-4 h-4 border-2 border-white opacity-30 rounded-full"></div>
        <div className="absolute bottom-1/5 right-1/3 w-3 h-3 border-2 border-white opacity-25 rounded-full"></div>
      </div>

      {/* Main content container */}
      <div className="w-full max-w-md relative z-10">
        {/* Search Bar at the top */}
        <div className="mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search plays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-2 border-white rounded-lg shadow-lg text-green-800 placeholder-green-500 focus:ring-2 focus:ring-white focus:border-white"
            />
          </div>
          {/* Chalk underline for search bar */}
          <div className="absolute -bottom-2 left-2 right-2 h-0.5 bg-white opacity-60"></div>
        </div>
        
        <SearchHeader />
        <SearchBySection />
      </div>
    </div>
  );
};

export default SearchPage;
