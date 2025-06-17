
interface VideoPreviewProps {
  platform: string;
}

const VideoPreview = ({ platform }: VideoPreviewProps) => {
  return (
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
  );
};

export default VideoPreview;
