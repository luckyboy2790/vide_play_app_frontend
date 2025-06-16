
import { useState, useEffect } from 'react';
import { ArrowDown, Heart, Bookmark } from 'lucide-react';
import { mockPlays } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

const HomeFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plays, setPlays] = useState(mockPlays);
  const { toast } = useToast();

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

  const currentPlay = plays[currentIndex];

  return (
    <div className="relative h-[calc(100vh-140px)] overflow-hidden bg-black">
      {/* Current Play Card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Video Container */}
          <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              </div>
              <p className="text-sm">Video Preview</p>
              <p className="text-xs opacity-75">{currentPlay.source}</p>
            </div>
          </div>

          {/* Play Info */}
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {currentPlay.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-600 text-sm mb-4">{currentPlay.description}</p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => likePlay(currentPlay.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPlay.liked 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} fill={currentPlay.liked ? 'currentColor' : 'none'} />
                <span className="text-sm">{currentPlay.likes}</span>
              </button>

              <button
                onClick={() => saveToPlaybook(currentPlay.id)}
                disabled={currentPlay.saved}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  currentPlay.saved
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Bookmark size={20} />
                <span className="text-sm">
                  {currentPlay.saved ? 'Saved' : 'Save to Playbook'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        {plays.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-center">
        <ArrowDown size={24} className="mx-auto mb-2 animate-bounce" />
        <p className="text-sm">Swipe up for next play</p>
      </div>

      {/* Touch Swipe Areas */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 cursor-pointer"
        onClick={() => handleSwipe('down')}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 cursor-pointer"
        onClick={() => handleSwipe('up')}
      />
    </div>
  );
};

export default HomeFeed;
