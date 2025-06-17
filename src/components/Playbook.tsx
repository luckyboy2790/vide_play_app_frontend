
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      {/* Play of the Day Header */}
      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-white mb-4">Play of the Day</h2>
        
        {/* Video Rectangle */}
        {playOfTheDay && (
          <div className="bg-black rounded-lg overflow-hidden mb-6">
            <div className="aspect-video relative flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1"></div>
                </div>
                <p className="text-base font-medium">Play on Loop</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Find Your Play Section */}
      <div className="text-center flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-white mb-4">Find Your Play</h3>
        
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {/* Formation Block */}
          <div className="bg-white rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <span className="text-xl font-bold text-gray-800">Formation</span>
          </div>
          
          {/* Play Type Block */}
          <div className="bg-white rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <span className="text-xl font-bold text-gray-800">Play Type</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playbook;
