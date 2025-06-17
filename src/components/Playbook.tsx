
import { useState, useEffect } from 'react';
import { Bookmark, Edit, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { playTypes, formations } from '@/constants/playOptions';

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

const Playbook = () => {
  const [plays, setPlays] = useState<PlayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayType, setSelectedPlayType] = useState<string>('all');
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();

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

        // Transform data to match our interface
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

        setPlays(transformedPlays);
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

  // Filter plays based on selected filters
  const filteredPlays = plays.filter(play => {
    const playTypeMatch = selectedPlayType === 'all' || play.play_type === selectedPlayType;
    const formationMatch = selectedFormation === 'all' || play.formation === selectedFormation;
    return playTypeMatch && formationMatch;
  });

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

  if (plays.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Plays Found</h3>
          <p className="text-gray-500">No plays have been created yet. Start by creating your first play!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          {filteredPlays.length} of {plays.length} play{plays.length !== 1 ? 's' : ''} shown
        </p>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Play Type:</label>
            <select
              value={selectedPlayType}
              onChange={(e) => setSelectedPlayType(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {playTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Formation:</label>
            <select
              value={selectedFormation}
              onChange={(e) => setSelectedFormation(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Formations</option>
              {formations.map((formation) => (
                <option key={formation.value} value={formation.value}>
                  {formation.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlays.map((play) => (
          <PlayCard key={play.id} play={play} />
        ))}
      </div>

      {filteredPlays.length === 0 && plays.length > 0 && (
        <div className="text-center py-12">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Matches Found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more plays.</p>
        </div>
      )}
    </div>
  );
};

const PlayCard = ({ play }: { play: PlayData }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
    {/* Video Thumbnail */}
    <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
        </div>
        <p className="text-xs opacity-75">Play Preview</p>
      </div>
      
      {/* Play Type Badge */}
      {play.play_type && (
        <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-full">
          <span className="text-white text-xs font-medium">{play.play_type}</span>
        </div>
      )}

      {/* Formation Badge */}
      {play.formation && (
        <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded-full">
          <span className="text-white text-xs font-medium">{play.formation}</span>
        </div>
      )}
    </div>

    {/* Play Info */}
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
        {play.tags.slice(0, 3).map((tag: string, index: number) => (
          <span
            key={index}
            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {play.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{play.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          by @{play.shared_by}
        </span>
        <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-green-600 transition-colors">
          <Edit size={14} />
          <span className="text-xs">View</span>
        </button>
      </div>
    </div>
  </div>
);

export default Playbook;
