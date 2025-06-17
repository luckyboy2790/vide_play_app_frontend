
import { useState } from 'react';
import { Home, BookOpen, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import HomeFeed from '@/components/HomeFeed';
import Playbook from '@/components/Playbook';
import SearchPage from '@/components/SearchPage';
import ProfilePage from '@/components/ProfilePage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been logged out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

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
      {/* Header with For You Plays tab */}
      {activeTab === 'home' && (
        <header className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-transparent">
          <div className="flex justify-between items-center">
            <button className="text-white font-bold text-lg border-b-2 border-white pb-1">
              For You Plays
            </button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </header>
      )}

      {/* Header for other tabs */}
      {activeTab !== 'home' && (
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'playbook' && 'My Playbook'}
              {activeTab === 'search' && 'Search Plays'}
              {activeTab === 'profile' && 'Profile'}
            </h1>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100"
            >
              <LogOut size={16} />
            </Button>
          </div>
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
