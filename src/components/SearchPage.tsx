
import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlayData {
  id: string;
  caption: string;
  play_type: string;
  formation: string;
  video_url: string;
  shared_by: string;
  created_at: string;
  tags: string[];
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [allPlays, setAllPlays] = useState<PlayData[]>([]);
  const [filteredPlays, setFilteredPlays] = useState<PlayData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const filters = [
    { id: 'all', label: 'All Plays', emoji: '🏈' },
    { id: 'inside-run', label: 'Inside Run', emoji: '🏃' },
    { id: 'outside-run', label: 'Outside Run', emoji: '💨' },
    { id: 'quick-pass', label: 'Quick Pass', emoji: '⚡' },
    { id: 'deep-pass', label: 'Deep Pass', emoji: '🎯' },
    { id: 'play-action-pass', label: 'Play Action', emoji: '🎭' },
  ];

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const { data, error } = await supabase
          .from('plays')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching plays:', error);
          toast({
            title: "Error loading plays",
            description: "Could not load plays from database.",
            variant: "destructive",
          });
          return;
        }

        const transformedPlays: PlayData[] = (data || []).map(play => ({
          id: play.id.toString(),
          caption: play.caption || '',
          play_type: play.play_type || '',
          formation: play.formation || '',
          video_url: play.video_url || '',
          shared_by: play.shared_by || 'Anonymous',
          created_at: play.created_at,
          tags: Array.isArray(play.tags) ? play.tags : []
        }));

        setAllPlays(transformedPlays);
        setFilteredPlays(transformedPlays);
      } catch (error) {
        console.error('Error fetching plays:', error);
        toast({
          title: "Error loading plays",
          description: "Could not load plays from database.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlays();
  }, [toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlays(query, selectedFilter);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    filterPlays(searchQuery, filter);
  };

  const filterPlays = (query: string, filter: string) => {
    let filtered = allPlays;

    // Filter by search query
    if (query) {
      filtered = filtered.filter(play =>
        play.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        (play.caption && play.caption.toLowerCase().includes(query.toLowerCase())) ||
        (play.play_type && play.play_type.toLowerCase().includes(query.toLowerCase())) ||
        (play.formation && play.formation.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filter by play type
    if (filter !== 'all') {
      filtered = filtered.filter(play => play.play_type === filter);
    }

    setFilteredPlays(filtered);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="relative mb-6">
        <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search plays, formations, tags..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
        />
      </div>

      {/* Filter Cards */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Play Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFilter === filter.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{filter.emoji}</div>
                <div className="text-sm font-medium">{filter.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
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
            <div key={play.i d} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-xs opacity-75">Play Preview</p>
                </div>
                
                {play.play_type && (
                  <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-full">
                    <span className="text-white text-xs font-medium">{play.play_type}</span>
                  </div>
                )}

                {play.formation && (
                  <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded-full">
                    <span className="text-white text-xs font-medium">{play.formation}</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {play.play_type || 'Untitled Play'}
                    {play.formation && ` - ${play.formation}`}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {play.caption || 'No description provided'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
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

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    by @{play.shared_by}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(play.created_at).toLocaleDateString()}
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
