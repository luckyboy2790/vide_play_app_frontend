
import React from 'react';

const SearchPage = () => {
  return (
    <div className="p-4 relative">
      {/* Search By Section */}
      <div className="mb-8">
        <h3 className="text-white font-bold mb-6 text-xl text-center" style={{ fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Search By
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Formation Block */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[120px] border-2 border-white hover:bg-green-100 transition-colors cursor-pointer">
            <span className="text-2xl font-bold text-green-800" style={{ fontFamily: 'Georgia, serif' }}>Formation</span>
          </div>
          
          {/* Play Type Block */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[120px] border-2 border-white hover:bg-green-100 transition-colors cursor-pointer">
            <span className="text-2xl font-bold text-green-800" style={{ fontFamily: 'Georgia, serif' }}>Play Type</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
