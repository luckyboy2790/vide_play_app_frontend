
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
    <div className="min-h-screen bg-green-800 max-w-sm mx-auto relative" style={{ backgroundColor: '#1a4d3a' }}>
      {/* Header for non-home tabs */}
      {activeTab !== 'home' && (
        <header className="bg-green-900 border-b-2 border-white px-4 py-3 relative">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              {activeTab === 'playbook' && '📋 PLAYBOOK'}
              {activeTab === 'search' && '🔍 SEARCH PLAYS'}
              {activeTab === 'profile' && '👤 COACH PROFILE'}
            </h1>
          </div>
          {/* Chalk underline */}
          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white opacity-80"></div>
        </header>
      )}

      {/* Chalkboard texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }}></div>

      {/* Main Content */}
      <main className="relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation - Chalkboard style */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-green-900 border-t-2 border-white relative">
        {/* Chalk dust effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
        
        <div className="flex justify-around items-center py-3">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 transition-all duration-200 ${
              activeTab === 'home' 
                ? 'text-white transform scale-110' 
                : 'text-green-300 hover:text-white hover:scale-105'
            }`}
          >
            <Home size={24} className="drop-shadow-lg" />
            <span className="text-xs mt-1 font-semibold">Home</span>
            {activeTab === 'home' && <div className="w-6 h-0.5 bg-white mt-1 rounded"></div>}
          </button>
          
          <button
            onClick={() => setActiveTab('playbook')}
            className={`flex flex-col items-center p-2 transition-all duration-200 ${
              activeTab === 'playbook' 
                ? 'text-white transform scale-110' 
                : 'text-green-300 hover:text-white hover:scale-105'
            }`}
          >
            <BookOpen size={24} className="drop-shadow-lg" />
            <span className="text-xs mt-1 font-semibold">Playbook</span>
            {activeTab === 'playbook' && <div className="w-6 h-0.5 bg-white mt-1 rounded"></div>}
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center p-2 transition-all duration-200 ${
              activeTab === 'search' 
                ? 'text-white transform scale-110' 
                : 'text-green-300 hover:text-white hover:scale-105'
            }`}
          >
            <Search size={24} className="drop-shadow-lg" />
            <span className="text-xs mt-1 font-semibold">Search</span>
            {activeTab === 'search' && <div className="w-6 h-0.5 bg-white mt-1 rounded"></div>}
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center p-2 transition-all duration-200 ${
              activeTab === 'profile' 
                ? 'text-white transform scale-110' 
                : 'text-green-300 hover:text-white hover:scale-105'
            }`}
          >
            <User size={24} className="drop-shadow-lg" />
            <span className="text-xs mt-1 font-semibold">Profile</span>
            {activeTab === 'profile' && <div className="w-6 h-0.5 bg-white mt-1 rounded"></div>}
          </button>

          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 border border-white ml-2"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
