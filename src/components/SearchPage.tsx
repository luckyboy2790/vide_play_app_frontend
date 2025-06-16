
import { useState } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { mockPlays } from '@/utils/mockData';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredPlays, setFilteredPlays] = useState(mockPlays);

  const filters = [
    { id: 'all', label: 'All Plays' },
    { id: 'red-zone', label: 'Red Zone' },
    { id: 'play-action', label: 'Play Action' },
    { id: 'screen', label: 'Screen Pass' },
    { id: 'deep', label: 'Deep Ball' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlays(query, selectedFilter);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    filterPlays(searchQuery, filter);
  };

  const filterPlays = (query: string, filter: string) => {
    let filtered = mockPlays;

    // Filter by search query
    if (query) {
      filtered = filtered.filter(play =>
        play.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        play.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(play =>
        play.tags.some(tag => tag.toLowerCase().includes(filter.replace('-', ' ')))
      );
    }

    setFilteredPlays(filtered);
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="relative mb-4">
        <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search plays, formations, tags..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedFilter === filter.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.id !== 'all' && <Filter size={16} />}
            <span className="text-sm">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredPlays.length} result{filteredPlays.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Results Grid */}
      {filteredPlays.length === 0 ? (
        <div className="text-center py-12">
          <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No plays found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPlays.map((play) => (
            <div key={play.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-xs opacity-75">{play.source}</p>
                </div>
              </div>

              {/* Play Info */}
              <div className="p-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {play.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {play.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{play.tags.length - 2} more
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{play.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {play.likes} likes
                  </span>
                  <span className="text-xs text-gray-500">
                    from {play.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
