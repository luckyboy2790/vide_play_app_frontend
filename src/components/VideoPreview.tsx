import ReactPlayer from "react-player";

interface VideoPreviewProps {
  videoUrl: string;
}

const VideoPreview = ({ videoUrl }: VideoPreviewProps) => {
  return (
    <div className="aspect-video bg-gray-900 rounded-lg relative flex items-center justify-center">
      <ReactPlayer
        url={videoUrl}
        playing={false}
        loop
        muted
        controls={false}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default VideoPreview;
