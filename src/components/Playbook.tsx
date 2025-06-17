
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play } from 'lucide-react';

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

const Playbook = () => {
  const [playOfTheDay, setPlayOfTheDay] = useState<PlayData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlayOfTheDay = async () => {
      try {
        const { data, error } = await supabase
          .from('plays')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching play of the day:', error);
          toast({
            title: "Error loading play",
            description: "Could not load play of the day.",
            variant: "destructive",
          });
          return;
        }

        if (data && data.length > 0) {
          const play = data[0];
          setPlayOfTheDay({
            id: play.id.toString(),
            caption: play.caption || '',
            play_type: play.play_type || '',
            formation: play.formation || '',
            video_url: play.video_url || '',
            shared_by: play.shared_by || 'Anonymous',
            created_at: play.created_at,
            tags: Array.isArray(play.tags) ? play.tags : []
          });
        }
      } catch (error) {
        console.error('Error fetching play of the day:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayOfTheDay();
  }, [toast]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-3"></div>
          <p className="text-lg font-bold" style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Loading Playbook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden relative">
      {/* Chalk dust particles effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-12 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Play of the Day Header */}
      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-3xl font-bold text-white mb-4 relative" style={{ 
          fontFamily: 'Georgia, serif', 
          textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
          transform: 'rotate(-1deg)'
        }}>
          ⭐ PLAY OF THE DAY ⭐
          {/* Underline chalk effect */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-white opacity-70 rounded-full" style={{ transform: 'translateX(-50%) rotate(1deg)' }}></div>
        </h2>
        
        {/* Video Rectangle with enhanced chalkboard styling */}
        {playOfTheDay && (
          <div className="bg-black rounded-lg overflow-hidden mb-6 relative border-4 border-white border-opacity-80 shadow-2xl" style={{ 
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.6)' 
          }}>
            {/* Chalk frame corners */}
            <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-white opacity-60"></div>
            <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-white opacity-60"></div>
            <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-white opacity-60"></div>
            <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-white opacity-60"></div>
            
            <div className="aspect-video relative flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                  <Play size={32} className="text-white ml-1 drop-shadow-lg" fill="white" />
                </div>
                <p className="text-lg font-bold" style={{ 
                  fontFamily: 'Georgia, serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '1px'
                }}>🔄 PLAY ON LOOP 🔄</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Find Your Play Section with enhanced chalkboard styling */}
      <div className="text-center flex-1 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-6 relative" style={{ 
          fontFamily: 'Georgia, serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          transform: 'rotate(0.5deg)'
        }}>
          📚 FIND YOUR PLAY 📚
          {/* Chalk underline */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-white opacity-60 rounded-full"></div>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {/* Formation Block - Enhanced chalkboard style */}
          <div className="bg-white rounded-lg p-6 flex items-center justify-center min-h-[100px] relative transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-gray-200" style={{ 
            boxShadow: '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)'
          }}>
            {/* Chalk dust effect on corners */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-gray-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-gray-300 rounded-full opacity-40"></div>
            
            <span className="text-xl font-bold text-gray-800 relative" style={{ 
              fontFamily: 'Georgia, serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              transform: 'rotate(-0.5deg)'
            }}>
              🏈 Formation
            </span>
          </div>
          
          {/* Play Type Block - Enhanced chalkboard style */}
          <div className="bg-white rounded-lg p-6 flex items-center justify-center min-h-[100px] relative transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-gray-200" style={{ 
            boxShadow: '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)'
          }}>
            {/* Chalk dust effect on corners */}
            <div className="absolute top-2 left-1 w-1 h-1 bg-gray-300 rounded-full opacity-50"></div>
            <div className="absolute bottom-1 right-2 w-2 h-2 bg-gray-200 rounded-full opacity-40"></div>
            
            <span className="text-xl font-bold text-gray-800 relative" style={{ 
              fontFamily: 'Georgia, serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              transform: 'rotate(0.3deg)'
            }}>
              ⚡ Play Type
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playbook;
