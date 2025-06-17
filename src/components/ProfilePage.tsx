
import { useState, useEffect } from 'react';
import { User, Share, Bookmark, Trophy } from 'lucide-react';
import { Play } from '@/types/play';

const ProfilePage = () => {
  const [savedCount, setSavedCount] = useState(0);
  const [sharedPlays, setSharedPlays] = useState<Play[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedPlays') || '[]');
    setSavedCount(saved.length);

    // Get plays shared by current user
    const allPlays = JSON.parse(localStorage.getItem('allPlays') || '[]');
    const userPlays = allPlays.filter((play: Play) => play.shared_by === 'current_user');
    setSharedPlays(userPlays);
  }, []);

  const stats = [
    {
      icon: Share,
      label: 'Plays Shared',
      value: sharedPlays.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Bookmark,
      label: 'Plays Saved',
      value: savedCount,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Trophy,
      label: 'Total Likes',
      value: sharedPlays.reduce((sum, play) => sum + play.likes, 0),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Coach Johnson</h2>
        <p className="text-gray-600">Varsity Football Coach</p>
        <p className="text-sm text-gray-500 mt-2">Lincoln High School</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User's Shared Plays */}
      {sharedPlays.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Shared Plays</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sharedPlays.slice(0, 4).map((play) => (
              <div key={play.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-1">
                      <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                    </div>
                    <p className="text-xs opacity-75">{play.source}</p>
                  </div>
                  {play.play_type && (
                    <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-full">
                      <span className="text-white text-xs font-medium uppercase">{play.play_type}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                    {play.description || play.caption}
                  </p>
                  <span className="text-xs text-gray-500">{play.likes} likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {sharedPlays.slice(0, 3).map((play, index) => (
            <div key={play.id} className="flex items-start">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-gray-900">
                  Shared play from {play.source}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(play.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
            <div>
              <p className="text-sm text-gray-900">Saved "Screen Pass - Bubble Route"</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></div>
            <div>
              <p className="text-sm text-gray-900">Received 8 likes on shared play</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings/About */}
      <div className="mt-6 text-center">
        <button className="text-green-600 hover:text-green-700 font-medium">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
