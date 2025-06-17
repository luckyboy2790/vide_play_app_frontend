
import { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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

const ProfilePage = () => {
  const [userPlays, setUserPlays] = useState<PlayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteFormation, setFavoriteFormation] = useState<string>('');
  const [favoritePlayType, setFavoritePlayType] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('plays')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user plays:', error);
          toast({
            title: "Error loading plays",
            description: "Could not load your plays.",
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
          shared_by: play.shared_by || 'You',
          created_at: play.created_at,
          tags: Array.isArray(play.tags) ? play.tags : []
        }));

        setUserPlays(transformedPlays);

        // Calculate favorite formation and play type
        const formationCounts: { [key: string]: number } = {};
        const playTypeCounts: { [key: string]: number } = {};

        transformedPlays.forEach(play => {
          if (play.formation) {
            formationCounts[play.formation] = (formationCounts[play.formation] || 0) + 1;
          }
          if (play.play_type) {
            playTypeCounts[play.play_type] = (playTypeCounts[play.play_type] || 0) + 1;
          }
        });

        const topFormation = Object.entries(formationCounts).sort((a, b) => b[1] - a[1])[0];
        const topPlayType = Object.entries(playTypeCounts).sort((a, b) => b[1] - a[1])[0];

        setFavoriteFormation(topFormation ? topFormation[0] : 'Wing');
        setFavoritePlayType(topPlayType ? topPlayType[0] : 'Inside Run');

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      {/* Profile Header with Settings */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 relative flex-shrink-0 mb-4">
        <button className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={18} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Coach Will</h2>
          </div>
        </div>
      </div>

      {/* Playbook Section */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex-shrink-0 mb-4">
        <h3 className="text-base font-semibold text-gray-900">Playbook - {userPlays.length} plays</h3>
      </div>

      {/* Favorite Formation & Play Type Grid - Smaller blocks like search */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="bg-white rounded-lg p-6 flex items-center justify-center min-h-[80px] border-2 border-white hover:bg-green-100 transition-colors">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Favorite Formation</p>
            <span className="text-lg font-bold text-green-800" style={{ fontFamily: 'Georgia, serif' }}>{favoriteFormation}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 flex items-center justify-center min-h-[80px] border-2 border-white hover:bg-green-100 transition-colors">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Favorite Play Type</p>
            <span className="text-lg font-bold text-green-800" style={{ fontFamily: 'Georgia, serif' }}>{favoritePlayType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
