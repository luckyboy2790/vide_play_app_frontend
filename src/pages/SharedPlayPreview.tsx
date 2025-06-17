
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SharedPlayPreview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const initialVideoUrl = searchParams.get('video_url') || '';
  const initialCaption = searchParams.get('caption') || '';
  const platform = searchParams.get('platform') || '';
  
  const [video_url, setVideo_url] = useState<string>(initialVideoUrl);
  const [caption, setCaption] = useState<string>(initialCaption);
  const [playType, setPlayType] = useState<string>('');
  const [formation, setFormation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const playTypes = [
    { value: 'inside-run', label: 'Inside Run' },
    { value: 'outside-run', label: 'Outside Run' },
    { value: 'option', label: 'Option' },
    { value: 'quick-pass', label: 'Quick Pass' },
    { value: 'medium-pass', label: 'Medium Pass' },
    { value: 'deep-pass', label: 'Deep Pass' },
    { value: 'play-action-pass', label: 'Play Action Pass' },
    { value: 'screen-pass', label: 'Screen Pass' },
    { value: 'trick', label: 'Trick' },
  ];

  const formations = [
    { value: 'trips', label: 'Trips' },
    { value: 'trio', label: 'Trio' },
    { value: 'ace', label: 'Ace' },
    { value: 'empty', label: 'Empty' },
    { value: 'full-house', label: 'Full House' },
    { value: 'doubles', label: 'Doubles' },
    { value: 'doubles-close', label: 'Doubles Close' },
    { value: 'split-twins-offset', label: 'Split Twins Offset' },
    { value: 'tight', label: 'Tight' },
    { value: 'wing', label: 'Wing' },
  ];

  const handleSavePlay = async () => {
    if (!playType || !formation) {
      toast({
        title: "Please select both play type and formation",
        description: "Both play type and formation are required before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save plays.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Insert into Supabase plays table
      const { error } = await supabase
        .from('plays')
        .insert({
          video_url: video_url,
          caption: caption,
          play_type: playType,
          formation: formation,
          tags: [],
          thumbnail_url: '', // Use empty string instead of null
          shared_by: platform,
          user_id: user.id
        });

      if (error) {
        console.error('Error saving play:', error);
        toast({
          title: "Error saving play",
          description: "There was an error saving your play. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Play saved!",
        description: "Your play has been successfully saved.",
      });

      // Navigate back to home
      navigate('/');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error saving play",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Shared Play Preview</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Video URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <Input
            type="url"
            placeholder="Paste video link here..."
            value={video_url}
            onChange={(e) => setVideo_url(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Caption Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <Input
            type="text"
            placeholder="Enter caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Video Preview Placeholder */}
        <div className="aspect-video bg-gray-900 rounded-lg relative flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1"></div>
            </div>
            <p className="text-lg font-medium">Play Preview</p>
            <p className="text-sm opacity-75 mt-1">from {platform}</p>
          </div>
          
          {/* Platform badge */}
          <div className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded-full">
            <span className="text-white text-xs font-medium capitalize">{platform}</span>
          </div>
        </div>

        {/* Caption Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Caption</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {caption || 'No caption provided'}
          </p>
        </div>

        {/* Play Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Play Type *
          </label>
          <Select value={playType} onValueChange={setPlayType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select play type..." />
            </SelectTrigger>
            <SelectContent>
              {playTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Formation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formation *
          </label>
          <Select value={formation} onValueChange={setFormation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select formation..." />
            </SelectTrigger>
            <SelectContent>
              {formations.map((form) => (
                <SelectItem key={form.value} value={form.value}>
                  {form.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSavePlay}
          disabled={isLoading || !playType || !formation}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <Save size={20} className="mr-2" />
          {isLoading ? 'Saving Play...' : 'Save Play'}
        </Button>
      </div>
    </div>
  );
};

export default SharedPlayPreview;
