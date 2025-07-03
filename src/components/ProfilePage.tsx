import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCookies } from "react-cookie";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "@/contexts/AuthContext";

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

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ProfilePage = () => {
  const [userPlays, setUserPlays] = useState<PlayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteFormation, setFavoriteFormation] = useState<string>("");
  const [favoritePlayType, setFavoritePlayType] = useState<string>("");
  const [userData, setUserData] = useState<any>({});
  const { toast } = useToast();

  const [cookies] = useCookies(["authToken"]);

  const { signOut } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userReponse = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${cookies.authToken}`,
          },
        });

        const userResult = await userReponse.json();

        setUserData(userResult?.user[0]);

        const playResponse = await fetch(`${API_URL}/api/plays`, {
          headers: {
            Authorization: `Bearer ${cookies.authToken}`,
          },
        });

        const playResult = await playResponse.json();

        setUserPlays(playResult.plays);

        const fypResponse = await fetch(`${API_URL}/api/plays/fyp`, {
          headers: {
            Authorization: `Bearer ${cookies.authToken}`,
          },
        });

        const fypResult = await fypResponse.json();

        setFavoriteFormation(fypResult?.most_used?.formation);
        setFavoritePlayType(fypResult?.most_used?.play_type);
      } catch (error) {
        console.error("Error fetching user data:", error);
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
  }, [toast, cookies]);

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
    <div className="h-full flex flex-col p-4 overflow-hidden pt-20">
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 relative flex-shrink-0 mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {userData?.username}
            </h2>
          </div>
        </div>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={signOut}
        >
          <RiLogoutBoxRLine size={24} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex-shrink-0 mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Playbook - {userPlays.length} plays
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        <div className="bg-white rounded-lg p-3 flex items-center justify-center h-16 border-2 border-white hover:bg-green-100 transition-colors">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Favorite Formation</p>
            <span
              className="text-sm font-bold text-green-800"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {favoriteFormation}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 flex items-center justify-center h-16 border-2 border-white hover:bg-green-100 transition-colors">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Favorite Play Type</p>
            <span
              className="text-sm font-bold text-green-800"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {favoritePlayType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
