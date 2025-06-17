
import { useState, useEffect } from 'react';
import { User, Share, Bookmark, Trophy, Settings, TrendingUp } from 'lucide-react';
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

        setFavoriteFormation(topFormation ? topFormation[0] : 'None');
        setFavoritePlayType(topPlayType ? topPlayType[0] : 'None');

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
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header with Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Coach Johnson</h2>
              <p className="text-gray-600">Varsity Football Coach</p>
              <p className="text-sm text-gray-500">Lincoln High School</p>
            </div>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Playbook Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Bookmark className="text-green-600" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Playbook</h3>
            <p className="text-2xl font-bold text-green-600">{userPlays.length} plays</p>
          </div>
        </div>
      </div>

      {/* Favorite Formation & Play Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Favorite Formation</h3>
          </div>
          <p className="text-xl font-bold text-blue-700">{favoriteFormation}</p>
          <p className="text-sm text-blue-600">Most used formation</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Favorite Play Type</h3>
          </div>
          <p className="text-xl font-bold text-green-700">{favoritePlayType}</p>
          <p className="text-sm text-green-600">Most used play type</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 mr-4">
              <Share size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">{userPlays.length}</p>
              <p className="text-gray-600">Plays Shared</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50 mr-4">
              <Trophy size={24} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">{userPlays.length * 5}</p>
              <p className="text-gray-600">Total Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Plays */}
      {userPlays.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Plays</h3>
          <div className="space-y-4">
            {userPlays.slice(0, 3).map((play) => (
              <div key={play.id} className="flex items-start border-b border-gray-100 pb-4 last:border-b-0">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {play.play_type || 'Untitled Play'}
                    {play.formation && ` - ${play.formation}`}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {play.caption || 'No description'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(play.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Button */}
      <div className="text-center">
        <button className="text-green-600 hover:text-green-700 font-medium">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
