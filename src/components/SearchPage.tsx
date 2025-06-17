
import React from 'react';
import SearchHeader from './SearchHeader';
import SearchBySection from './SearchBySection';

const SearchPage = () => {
  return (
    <div className="p-4 relative">
      {/* Search By Section */}
      <div className="mb-8">
        <SearchHeader />
        <SearchBySection />
      </div>
    </div>
  );
};

export default SearchPage;
