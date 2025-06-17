
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
      <div className="p-4 text-center">
        <div className="py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading plays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {/* Search Input - Chalkboard style */}
      <div className="relative mb-6">
        <div className="relative bg-green-900 border-2 border-white rounded-lg p-1">
          <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white z-10" />
          <input
            type="text"
            placeholder="Search plays, formations, tags..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-green-800 border-none rounded-md text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>
        {/* Chalk dust effect */}
        <div className="absolute -bottom-1 left-2 right-2 h-px bg-white opacity-40"></div>
      </div>

      {/* Filter Cards - Chalkboard style */}
      <div className="mb-6">
        <h3 className="text-white font-bold mb-4 text-lg" style={{ fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          ⚡ FILTER BY PLAY TYPE
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'border-white bg-white text-green-800 shadow-lg transform scale-105'
                  : 'border-white bg-green-700 text-white hover:bg-green-600 hover:scale-102'
              }`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{filter.emoji}</div>
                <div className="text-sm font-bold">{filter.label}</div>
              </div>
              {selectedFilter === filter.id && (
                <div className="absolute inset-0 border-2 border-white rounded-lg opacity-50 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div className="mb-4">
        <p className="text-white font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
          📊 {filteredPlays.length} result{filteredPlays.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        <div className="w-full h-px bg-white opacity-30 mt-2"></div>
      </div>

      {/* Results Grid - Chalkboard style */}
      {filteredPlays.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-green-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-white">
            <SearchIcon size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>No plays found</h3>
          <p className="text-green-200">Try adjusting your search or filters</p>
          <div className="w-32 h-px bg-white opacity-50 mx-auto mt-4"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPlays.map((play) => (
            <div key={play.id} className="bg-green-700 rounded-lg border-2 border-white overflow-hidden hover:bg-green-600 transition-all duration-200 hover:scale-105 relative">
              {/* Play preview area */}
              <div className="aspect-video bg-green-800 relative flex items-center justify-center border-b-2 border-white">
                <div className="text-white text-center">
                  {/* Football diagram style */}
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <div className="text-2xl">🏈</div>
                    </div>
                    {/* Chalk lines */}
                    <div className="absolute top-8 left-1/2 w-12 h-px bg-white opacity-60 transform -translate-x-1/2"></div>
                    <div className="absolute top-8 left-1/2 w-8 h-px bg-white opacity-60 transform -translate-x-1/2 rotate-45"></div>
                    <div className="absolute top-8 left-1/2 w-8 h-px bg-white opacity-60 transform -translate-x-1/2 -rotate-45"></div>
                  </div>
                </div>
                
                {play.play_type && (
                  <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full">
                    <span className="text-green-800 text-xs font-bold">{play.play_type}</span>
                  </div>
                )}

                {play.formation && (
                  <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full">
                    <span className="text-green-800 text-xs font-bold">{play.formation}</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-white mb-1 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                    {play.play_type || 'Untitled Play'}
                    {play.formation && ` - ${play.formation}`}
                  </h3>
                  <p className="text-green-100 text-sm">
                    {play.caption || 'No description provided'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {play.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white text-green-800 text-xs rounded-full font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                  {play.tags.length > 2 && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full border border-white">
                      +{play.tags.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white pt-2">
                  <span className="text-xs text-green-200 font-semibold">
                    Coach @{play.shared_by}
                  </span>
                  <span className="text-xs text-green-200">
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
