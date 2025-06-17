
import React from 'react';

const SearchBySection = () => {
  return (
    <div className="grid grid-cols-2 gap-4 relative">
      {/* Chalk arrow pointing to Formation */}
      <div className="absolute -top-4 left-1/4 transform -translate-x-1/2">
        <div className="w-8 h-0.5 bg-white opacity-60 transform rotate-45"></div>
        <div className="absolute right-0 top-0 w-1.5 h-1.5 border-r-2 border-t-2 border-white opacity-60 transform rotate-45 -translate-y-0.5"></div>
      </div>
      
      {/* Chalk arrow pointing to Play Type */}
      <div className="absolute -top-4 right-1/4 transform translate-x-1/2">
        <div className="w-8 h-0.5 bg-white opacity-60 transform -rotate-45"></div>
        <div className="absolute left-0 top-0 w-1.5 h-1.5 border-l-2 border-t-2 border-white opacity-60 transform -rotate-45 -translate-y-0.5"></div>
      </div>
      
      {/* Formation Block */}
      <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[120px] border-2 border-white hover:bg-green-100 transition-colors cursor-pointer relative shadow-lg">
        <span className="text-2xl font-bold text-green-800" style={{ fontFamily: 'Georgia, serif' }}>Formation</span>
        {/* Small X mark in corner */}
        <div className="absolute top-2 right-2 text-green-600 opacity-40 text-sm font-bold">×</div>
      </div>
      
      {/* Play Type Block */}
      <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[120px] border-2 border-white hover:bg-green-100 transition-colors cursor-pointer relative shadow-lg">
        <span className="text-2xl font-bold text-green-800" style={{ fontFamily: 'Georgia, serif' }}>Play Type</span>
        {/* Small circle in corner */}
        <div className="absolute top-2 left-2 w-2 h-2 border border-green-600 opacity-40 rounded-full"></div>
      </div>
      
      {/* Connecting line between blocks */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-0.5 bg-white opacity-50"></div>
    </div>
  );
};

export default SearchBySection;
