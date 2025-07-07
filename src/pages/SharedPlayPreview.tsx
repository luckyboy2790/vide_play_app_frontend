import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SharedPlayHeader from "@/components/SharedPlayHeader";
import VideoPreview from "@/components/VideoPreview";
import CaptionDisplay from "@/components/CaptionDisplay";
import PlayForm from "@/components/PlayForm";
import { useCookies } from "react-cookie";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const SharedPlayPreview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const initialVideoUrl = searchParams.get("video_url") || "";
  const initialCaption = searchParams.get("caption") || "";
  const platform = searchParams.get("platform") || "";

  const [video_url, setVideo_url] = useState<string>(initialVideoUrl);
  const [caption, setCaption] = useState<string>(initialCaption);
  const [playType, setPlayType] = useState<string>("");
  const [formation, setFormation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [cookies] = useCookies(["authToken"]);

  const token = cookies.authToken;

  const isYouTubeUrl = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const downloadYouTubeFromRapidAPI = async (
    url: string
  ): Promise<string | null> => {
    const videoId = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/)?.[1];
    if (!videoId) return null;

    const apiUrl = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
        "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
      },
    });
    const data = await res.json();
    return data?.formats?.[0]?.url || null;
  };

  const handleSavePlay = async () => {
    if (!playType || !formation) {
      toast({
        title: "Please select both play type and formation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let finalVideoUrl = video_url;

      if (isYouTubeUrl(video_url)) {
        const youtubeDownloadUrl = await downloadYouTubeFromRapidAPI(video_url);
        if (!youtubeDownloadUrl)
          throw new Error("YouTube video not downloadable");
        finalVideoUrl = youtubeDownloadUrl;
      }

      const response = await fetch(`${API_URL}/api/plays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: finalVideoUrl,
          formation,
          type: playType,
          caption,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      toast({
        title: "Play saved!",
        description: "Your play has been successfully saved.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error saving play:", error);
      toast({
        title: "Error saving play",
        description: error.message || "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
      <SharedPlayHeader />

      <div className="p-4 space-y-6">
        <PlayForm
          video_url={video_url}
          setVideo_url={setVideo_url}
          caption={caption}
          setCaption={setCaption}
          playType={playType}
          setPlayType={setPlayType}
          formation={formation}
          setFormation={setFormation}
        />

        <VideoPreview videoUrl={video_url} />

        <CaptionDisplay caption={caption} />

        {/* Save Button */}
        <Button
          onClick={handleSavePlay}
          disabled={isLoading || !playType || !formation}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <Save size={20} className="mr-2" />
          {isLoading ? "Saving Play..." : "Save Play"}
        </Button>
      </div>
    </div>
  );
};

export default SharedPlayPreview;
