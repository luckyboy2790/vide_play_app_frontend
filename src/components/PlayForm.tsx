
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { playTypes, formations } from '@/constants/playOptions';

interface PlayFormProps {
  video_url: string;
  setVideo_url: (value: string) => void;
  caption: string;
  setCaption: (value: string) => void;
  playType: string;
  setPlayType: (value: string) => void;
  formation: string;
  setFormation: (value: string) => void;
}

const PlayForm = ({
  video_url,
  setVideo_url,
  caption,
  setCaption,
  playType,
  setPlayType,
  formation,
  setFormation,
}: PlayFormProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default PlayForm;
