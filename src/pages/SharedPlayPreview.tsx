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
      const response = await fetch(`${API_URL}/api/plays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: video_url,
          formation: formation,
          type: playType,
          caption: caption,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        console.error("Error saving play:", result);
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

      navigate("/");
    } catch (error) {
      console.error("Unexpected error:", error);
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
