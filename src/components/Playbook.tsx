
import { useState, useEffect } from 'react';
import { Bookmark, Edit, Filter } from 'lucide-react';
import { Play } from '@/types/play';

const Playbook = () => {
  const [savedPlays, setSavedPlays] = useState<Play[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  const playTypes = [
    { value: 'all', label: 'All Plays' },
    { value: 'pass', label: 'Pass' },
    { value: 'run', label: 'Run' },
    { value: 'trick', label: 'Trick' },
    { value: 'rpo', label: 'RPO' },
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedPlays') || '[]');
    setSavedPlays(saved);
  }, []);

  const filteredPlays = selectedType === 'all' 
    ? savedPlays 
    : savedPlays.filter(play => play.play_type === selectedType);

  // Group plays by play type for organized display
  const playsByType = filteredPlays.reduce((acc, play) => {
    const type = play.play_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(play);
    return acc;
  }, {} as Record<string, Play[]>);

  if (savedPlays.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Saved Plays</h3>
          <p className="text-gray-500">Start saving plays from the Home feed to build your playbook!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          {savedPlays.length} play{savedPlays.length !== 1 ? 's' : ''} saved
        </p>
        
        {/* Filter by play type */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          >
            {playTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedType === 'all' ? (
        // Show grouped by play type
        <div className="space-y-6">
          {Object.entries(playsByType).map(([type, plays]) => (
            <div key={type}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                {type} Plays ({plays.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plays.map((play) => (
                  <PlayCard key={play.id} play={play} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Show filtered plays
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPlays.map((play) => (
            <PlayCard key={play.id} play={play} />
          ))}
        </div>
      )}
    </div>
  );
};

const PlayCard = ({ play }: { play: Play }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
    {/* Video Thumbnail */}
    <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
        </div>
        <p className="text-xs opacity-75">{play.source}</p>
      </div>
      
      {/* Play Type Badge */}
      {play.play_type && (
        <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-full">
          <span className="text-white text-xs font-medium uppercase">{play.play_type}</span>
        </div>
      )}
    </div>

    {/* Play Info */}
    <div className="p-3">
      <div className="flex flex-wrap gap-1 mb-2">
        {play.tags.slice(0, 2).map((tag: string, index: number) => (
          <span
            key={index}
            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {play.tags.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{play.tags.length - 2} more
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {play.description || play.caption}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {play.likes} likes
        </span>
        <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-green-600 transition-colors">
          <Edit size={14} />
          <span className="text-xs">Edit</span>
        </button>
      </div>
    </div>
  </div>
);

export default Playbook;
