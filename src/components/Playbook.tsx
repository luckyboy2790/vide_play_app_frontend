
import { useState, useEffect } from 'react';
import { Bookmark, Edit, Filter, Star } from 'lucide-react';
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
  const [playOfTheDay, setPlayOfTheDay] = useState<PlayData | null>(null);
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
        
        // Set play of the day (most recent play for now)
        if (transformedPlays.length > 0) {
          setPlayOfTheDay(transformedPlays[0]);
        }
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

  return (
    <div className="p-4 space-y-6">
      {/* Play of the Day */}
      {playOfTheDay && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Play of the Day</h2>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
                <p className="text-lg font-medium">Featured Play</p>
              </div>
              {playOfTheDay.play_type && (
                <div className="absolute top-3 left-3 bg-green-600 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">{playOfTheDay.play_type}</span>
                </div>
              )}
              {playOfTheDay.formation && (
                <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">{playOfTheDay.formation}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {playOfTheDay.play_type || 'Featured Play'}
                {playOfTheDay.formation && ` - ${playOfTheDay.formation}`}
              </h3>
              <p className="text-gray-600 mb-3">
                {playOfTheDay.caption || 'Today\'s featured play'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">by @{playOfTheDay.shared_by}</span>
                <button className="flex items-center gap-1 px-3 py-1 text-green-600 hover:text-green-700 font-medium">
                  <Edit size={14} />
                  <span className="text-sm">View Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Plays</h3>
        
        {/* Play Type Filter Cards */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Play Type</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedPlayType('all')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPlayType === 'all' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🏈</div>
                <div className="text-sm font-medium">All Types</div>
              </div>
            </button>
            {playTypes.slice(0, 5).map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedPlayType(type.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPlayType === type.value 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {type.value.includes('run') ? '🏃' : 
                     type.value.includes('pass') ? '🎯' : 
                     type.value.includes('option') ? '⚡' : '🔥'}
                  </div>
                  <div className="text-sm font-medium">{type.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formation Filter Cards */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Formation</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedFormation('all')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFormation === 'all' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-sm font-medium">All Forms</div>
              </div>
            </button>
            {formations.slice(0, 5).map((formation) => (
              <button
                key={formation.value}
                onClick={() => setSelectedFormation(formation.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedFormation === formation.value 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🏟️</div>
                  <div className="text-sm font-medium">{formation.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div>
        <p className="text-gray-600 mb-4">
          {filteredPlays.length} play{filteredPlays.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Plays Grid */}
      {filteredPlays.length === 0 ? (
        <div className="text-center py-12">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Plays Found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more plays.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPlays.map((play) => (
            <PlayCard key={play.id} play={play} />
          ))}
        </div>
      )}
    </div>
  );
};

const PlayCard = ({ play }: { play: PlayData }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
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
