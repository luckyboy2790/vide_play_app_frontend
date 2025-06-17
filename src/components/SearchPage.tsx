
import React from 'react';
import SearchHeader from './SearchHeader';
import SearchBySection from './SearchBySection';

const SearchPage = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Search By Section */}
      <div className="w-full max-w-md">
        <SearchHeader />
        <SearchBySection />
      </div>
    </div>
  );
};

export default SearchPage;
