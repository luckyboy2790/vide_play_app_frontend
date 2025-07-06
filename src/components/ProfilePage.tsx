// src/pages/ProfilePage.tsx
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCookies } from "react-cookie";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from "@/contexts/AuthContext";
import UpdatePasswordModal from "@/components/UpdatePasswordModal";

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

const ProfilePage = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const [userPlays, setUserPlays] = useState<PlayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteFormation, setFavoriteFormation] = useState<string>("");
  const [favoritePlayType, setFavoritePlayType] = useState<string>("");
  const [userData, setUserData] = useState<any>({});
  const { toast } = useToast();
  const [cookies] = useCookies(["authToken"]);
  const { signOut } = useAuth();

  const [openPwdModal, setOpenPwdModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userReponse = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${cookies.authToken}` },
        });
        const userResult = await userReponse.json();
        setUserData(userResult?.user[0]);

        const playResponse = await fetch(`${API_URL}/api/plays`, {
          headers: { Authorization: `Bearer ${cookies.authToken}` },
        });
        const playResult = await playResponse.json();
        setUserPlays(playResult.plays);

        const fypResponse = await fetch(`${API_URL}/api/plays/fyp`, {
          headers: { Authorization: `Bearer ${cookies.authToken}` },
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
    <div className="h-full flex flex-col p-4 pt-20 space-y-6">
      {/* Top: Profile Info */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center gap-4">
        <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
          {userData?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {userData?.username}
          </h2>
          <p className="text-sm text-gray-500">{userData?.email}</p>
          <button
            className="text-sm text-green-700 hover:underline mt-1"
            onClick={() => setActiveTab("editProfile")}
          >
            Edit Profile
          </button>
        </div>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={signOut}
        >
          <RiLogoutBoxRLine size={24} />
        </button>
      </div>

      {/* Middle: Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg px-4 py-3 text-center flex flex-col items-center justify-between">
          <p className="text-xs text-gray-500">Plays Saved</p>
          <p className="text-sm font-medium text-green-800">
            {userPlays.length}
          </p>
        </div>
        <div className="bg-white border rounded-lg px-4 py-3 text-center flex flex-col items-center justify-between">
          <p className="text-xs text-gray-500">Favorite Formation</p>
          <p className="text-sm font-medium text-green-800">
            {favoriteFormation}
          </p>
        </div>
        <div className="bg-white border rounded-lg px-4 py-3 text-center flex flex-col items-center justify-between">
          <p className="text-xs text-gray-500">Favorite Play Type</p>
          <p className="text-sm font-medium text-green-800">
            {favoritePlayType}
          </p>
        </div>
      </div>

      {/* Bottom: Settings */}
      <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200 divide-y divide-gray-100">
        <button
          className="px-4 w-full text-left py-3 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpenPwdModal(true)}
        >
          Change Password
        </button>
        <button
          className="px-4 w-full text-left py-3 text-sm text-red-600 hover:bg-red-50"
          onClick={signOut}
        >
          Logout
        </button>
      </div>
      <UpdatePasswordModal
        open={openPwdModal}
        onClose={() => setOpenPwdModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
