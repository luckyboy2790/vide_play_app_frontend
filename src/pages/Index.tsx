
import { useState } from 'react';
import { Home, BookOpen, Search, User } from 'lucide-react';
import HomeFeed from '@/components/HomeFeed';
import Playbook from '@/components/Playbook';
import SearchPage from '@/components/SearchPage';
import ProfilePage from '@/components/ProfilePage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'playbook':
        return <Playbook />;
      case 'search':
        return <SearchPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-black max-w-sm mx-auto relative">
      {/* Header with TikTok-style tabs */}
      {activeTab === 'home' && (
        <header className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-transparent">
          <div className="flex justify-center items-center space-x-8">
            <button className="text-white/70 font-medium text-lg">Following</button>
            <button className="text-white font-bold text-lg border-b-2 border-white pb-1">
              For You
            </button>
            <button className="text-white/70 font-medium text-lg">LIVE</button>
          </div>
        </header>
      )}

      {/* Header for other tabs */}
      {activeTab !== 'home' && (
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'playbook' && 'My Playbook'}
            {activeTab === 'search' && 'Search Plays'}
            {activeTab === 'profile' && 'Profile'}
          </h1>
        </header>
      )}

      {/* Main Content */}
      <main className={activeTab === 'home' ? 'h-screen' : 'pb-20'}>
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-black border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === 'home' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('playbook')}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === 'playbook' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <BookOpen size={24} />
            <span className="text-xs mt-1">Playbook</span>
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === 'search' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Search size={24} />
            <span className="text-xs mt-1">Search</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === 'profile' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
