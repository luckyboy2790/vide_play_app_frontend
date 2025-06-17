import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share, MessageCircle, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Play } from '@/types/play';

const HomeFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const { data, error } = await supabase
          .from('plays')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching plays:', error);
          toast({
            title: "Error loading plays",
            description: "Could not load plays from database.",
            variant: "destructive",
          });
          return;
        }

        // Transform Supabase data to match Play interface
        const transformedPlays: Play[] = (data || []).map(play => ({
          id: play.id.toString(),
          video_url: play.video_url || '',
          caption: play.caption || '',
          play_type: play.play_type || '',
          formation: play.formation || '',
          tags: Array.isArray(play.tags) ? play.tags : [],
          shared_by: play.shared_by || 'Anonymous',
          created_at: play.created_at,
          likes: Math.floor(Math.random() * 1000), // Mock likes for now
          liked: false,
          saved: false,
          source: 'PlayCallVault',
          description: play.caption || ''
        }));

        setPlays(transformedPlays);
      } catch (error) {
        console.error('Error fetching plays:', error);
        toast({
          title: "Error loading plays",
          description: "Could not load plays from database.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlays();
  }, [toast]);

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < plays.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const saveToPlaybook = async (playId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save plays.",
        variant: "destructive",
      });
      return;
    }

    // For now, just update local state - in a real app you'd save to a user_saved_plays table
    const updatedPlays = plays.map(play => 
      play.id === playId ? { ...play, saved: true } : play
    );
    setPlays(updatedPlays);
    
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p className="text-lg">Loading plays...</p>
        </div>
      </div>
    );
  }

  if (plays.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p className="text-lg">No plays available</p>
          <p className="text-sm opacity-75 mt-2">Create your first play to get started!</p>
        </div>
      </div>
    );
  }

  const currentPlay = plays[currentIndex];

  return (
    <div className="relative h-full overflow-hidden bg-black">
      {/* Header with centered For You Plays and top-right FAB */}
      <header className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-transparent">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <button className="text-white font-bold text-lg border-b-2 border-white pb-1">
              For You Plays
            </button>
          </div>
          <button
            onClick={() => navigate('/shared-play-preview')}
            className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors opacity-80"
          >
            <Plus size={18} />
          </button>
        </div>
      </header>

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
            {currentPlay.formation && (
              <div className="mt-1 px-3 py-1 bg-blue-600 rounded-full text-xs font-medium">
                {currentPlay.formation.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-4">
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
                size={28} 
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
              <MessageCircle size={28} className="text-white" />
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
                size={28} 
                className={currentPlay.saved ? 'text-yellow-400 fill-yellow-400' : 'text-white'} 
              />
            </button>
            <span className="text-white text-xs font-semibold mt-1">Save</span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 flex items-center justify-center">
              <Share size={28} className="text-white" />
            </button>
            <span className="text-white text-xs font-semibold mt-1">Share</span>
          </div>
        </div>

        {/* Bottom Info Overlay - positioned with proper spacing from nav bar */}
        <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="mb-2">
            <div className="flex items-center mb-2">
              <span className="text-white font-semibold text-base">@{currentPlay.shared_by}</span>
              <span className="text-white ml-2">•</span>
              <span className="text-white ml-2 text-sm">Follow</span>
            </div>
            
            <p className="text-white text-sm mb-2 leading-relaxed">
              {currentPlay.description || currentPlay.caption}
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
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
              className={`w-1 h-4 rounded-full transition-colors ${
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
    </div>
  );
};

export default HomeFeed;
