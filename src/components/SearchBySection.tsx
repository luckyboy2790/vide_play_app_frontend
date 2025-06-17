
import React from 'react';

const SearchBySection = () => {
  return (
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
  );
};

export default SearchBySection;
