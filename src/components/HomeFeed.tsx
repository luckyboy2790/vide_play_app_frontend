import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share, MessageCircle, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPlays } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { Play } from '@/types/play';

const HomeFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plays, setPlays] = useState<Play[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load plays from mock database (localStorage) and combine with default mock plays
    const savedAllPlays = JSON.parse(localStorage.getItem('allPlays') || '[]');
    const combinedPlays = [...savedAllPlays, ...mockPlays];
    
    // Sort by created_at (newest first)
    const sortedPlays = combinedPlays.sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
    
    setPlays(sortedPlays);
  }, []);

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < plays.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const saveToPlaybook = (playId: string) => {
    const updatedPlays = plays.map(play => 
      play.id === playId ? { ...play, saved: true } : play
    );
    setPlays(updatedPlays);
    
    // Save to localStorage for persistence
    const savedPlays = JSON.parse(localStorage.getItem('savedPlays') || '[]');
    const playToSave = plays.find(p => p.id === playId);
    if (playToSave && !savedPlays.find((p: any) => p.id === playId)) {
      savedPlays.push({ ...playToSave, saved: true });
      localStorage.setItem('savedPlays', JSON.stringify(savedPlays));
    }
    
    toast({
      title: "Play Saved!",
      description: "Added to your playbook",
    });
  };

  const likePlay = (playId: string) => {
    const updatedPlays = plays.map(play => 
      play.id === playId 
        ? { ...play, liked: !play.liked, likes: play.liked ? play.likes - 1 : play.likes + 1 }
        : play
    );
    setPlays(updatedPlays);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handleSwipe('down');
      if (e.key === 'ArrowDown') handleSwipe('up');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  if (plays.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">Loading plays...</p>
        </div>
      </div>
    );
  }

  const currentPlay = plays[currentIndex];

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Full Screen Play Card */}
      <div className="absolute inset-0">
        {/* Video Background */}
        <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 relative flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
            </div>
            <p className="text-lg font-medium">Play Preview</p>
            <p className="text-sm opacity-75 mt-1">{currentPlay.source}</p>
            {currentPlay.play_type && (
              <div className="mt-2 px-3 py-1 bg-green-600 rounded-full text-xs font-medium">
                {currentPlay.play_type.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center border-2 border-white">
              <User size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => likePlay(currentPlay.id)}
              className="w-12 h-12 flex items-center justify-center"
            >
              <Heart 
                size={32} 
                className={currentPlay.liked ? 'text-red-500 fill-red-500' : 'text-white'} 
              />
            </button>
            <span className="text-white text-xs font-semibold mt-1">
              {currentPlay.likes < 1000 ? currentPlay.likes : `${(currentPlay.likes / 1000).toFixed(1)}K`}
            </span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 flex items-center justify-center">
              <MessageCircle size={32} className="text-white" />
            </button>
            <span className="text-white text-xs font-semibold mt-1">12</span>
          </div>

          {/* Save Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => saveToPlaybook(currentPlay.id)}
              className="w-12 h-12 flex items-center justify-center"
            >
              <Bookmark 
                size={32} 
                className={currentPlay.saved ? 'text-yellow-400 fill-yellow-400' : 'text-white'} 
              />
            </button>
            <span className="text-white text-xs font-semibold mt-1">Save</span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 flex items-center justify-center">
              <Share size={32} className="text-white" />
            </button>
            <span className="text-white text-xs font-semibold mt-1">Share</span>
          </div>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-white font-semibold text-lg">@{currentPlay.shared_by}</span>
              <span className="text-white ml-2">•</span>
              <span className="text-white ml-2 text-sm">Follow</span>
            </div>
            
            <p className="text-white text-sm mb-3 leading-relaxed">
              {currentPlay.description || currentPlay.caption}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {currentPlay.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-white text-sm"
                >
                  #{tag.replace(/\s+/g, '').toLowerCase()}
                </span>
              ))}
            </div>

            <div className="flex items-center">
              <div className="w-4 h-4 bg-white rounded-sm mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <span className="text-white text-sm">Original sound - {currentPlay.source}</span>
            </div>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
          {plays.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-6 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Touch Swipe Areas */}
      <div
        className="absolute top-16 left-0 right-0 h-1/2 cursor-pointer z-10"
        onClick={() => handleSwipe('down')}
      />
      <div
        className="absolute bottom-20 left-0 right-0 h-1/2 cursor-pointer z-10"
        onClick={() => handleSwipe('up')}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/shared-play-preview')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-20 transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default HomeFeed;
