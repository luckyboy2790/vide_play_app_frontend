import { useState, useEffect, useRef } from "react";
import { MessageCircle, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Play } from "@/types/play";
import { useCookies } from "react-cookie";
import ReactPlayer from "react-player";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const HomeFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragMoved, setDragMoved] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [cookies] = useCookies(["authToken"]);

  const token = cookies.authToken;

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const response = await fetch(`${API_URL}/api/plays`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        const data = result.plays;

        if (!response.ok) {
          console.error("Error fetching plays");
          toast({
            title: "Error loading plays",
            description: "Could not load plays from database.",
            variant: "destructive",
          });
          return;
        }

        const transformedPlays: Play[] = (data || []).map((play) => ({
          id: play.id.toString(),
          video_url: play.video_url || "",
          play_type: play.play_type || "",
          formation: play.formation || "",
          tags: Array.isArray(play.tags) ? play.tags : [],
          shared_by: play.shared_by || "Anonymous",
          created_at: play.date_added,
          liked: play.source === "link",
          source: play.source,
        }));

        setPlays(transformedPlays);
      } catch (error) {
        console.error("Error fetching plays:", error);
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

  const handleSwipe = (direction: "up" | "down") => {
    if (direction === "up" && currentIndex < plays.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "down" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") handleSwipe("down");
      if (e.key === "ArrowDown") handleSwipe("up");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeout: NodeJS.Timeout | null = null;

    const onScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const screenHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / screenHeight);

        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }, 100);
    };

    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [currentIndex]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: currentIndex * window.innerHeight,
        behavior: "smooth",
      });
    }
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
      <div className="flex flex-col h-full">
        <header className="z-20 px-4 py-3 bg-transparent">
          <div className="flex justify-between items-center">
            <div className="flex-1 flex justify-center">
              <button className="text-white font-bold text-lg border-b-2 border-white pb-1">
                Learn New Plays
              </button>
            </div>
            <button
              onClick={() => navigate("/shared-play-preview")}
              className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors opacity-80"
            >
              <Plus size={18} />
            </button>
          </div>
        </header>
        <div className="h-full flex items-center justify-center bg-black">
          <div className="text-white text-center">
            <p className="text-lg">No plays available</p>
            <p className="text-sm opacity-75 mt-2">
              Create your first play to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentPlay = plays[currentIndex];

  return (
    <div
      className={`relative h-full overflow-hidden bg-black ${
        isDragging ? "select-none" : ""
      }`}
    >
      <header className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-transparent">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <button className="text-white font-bold text-lg border-b-2 border-white pb-1">
              Learn New Plays
            </button>
          </div>
          <button
            onClick={() => navigate("/shared-play-preview")}
            className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors opacity-80"
          >
            <Plus size={18} />
          </button>
        </div>
      </header>

      <div className="h-full flex flex-col gap-3 justify-center items-center">
        <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 relative flex items-center justify-center">
          <div
            ref={scrollContainerRef}
            className="h-screen w-full overflow-y-auto hide-scrollbar snap-y snap-mandatory"
          >
            {plays.map((play, index) => (
              <div
                key={play.id}
                className="w-full h-screen snap-start flex justify-center items-center"
                onPointerDown={(e) => {
                  setDragStartY(e.clientY);
                  setDragMoved(false);
                  setIsDragging(true);
                }}
                onPointerMove={(e) => {
                  if (dragStartY !== null && !dragMoved) {
                    const deltaY = e.clientY - dragStartY;
                    if (Math.abs(deltaY) > 50) {
                      if (deltaY > 0) handleSwipe("down");
                      else handleSwipe("up");
                      setDragMoved(true);
                    }
                  }
                }}
                onPointerUp={() => {
                  setDragStartY(null);
                  setDragMoved(false);
                  setIsDragging(false);
                }}
              >
                <div className="text-white text-center max-w-md w-full h-full">
                  <div className="relative w-full h-full">
                    <ReactPlayer
                      url={play.video_url}
                      playing={index === currentIndex && isPlaying}
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
                      onClick={() => {
                        if (index === currentIndex) {
                          setIsPlaying((prev) => !prev);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="mb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {currentPlay.play_type && (
                <div className="mt-2 px-3 py-1 bg-green-600 rounded-full text-xs font-medium inline-block">
                  {currentPlay.play_type.toUpperCase()}
                </div>
              )}
              {currentPlay.formation && (
                <div className="flex justify-center items-center mt-1 px-3 py-1 bg-blue-600 rounded-full text-xs font-medium ml-2">
                  {currentPlay.formation.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentPlay.tags.map((tag, index) => (
                <span key={index} className="text-white text-sm">
                  #{tag.replace(/\s+/g, "").toLowerCase()}
                </span>
              ))}
            </div>

            <div className="flex items-center">
              <div className="w-4 h-4 bg-white rounded-sm mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <span className="text-white text-sm">
                Original sound - {currentPlay.source}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 z-30">
          {plays.map((_, tapIndex) => (
            <div
              key={tapIndex}
              className={`w-1 h-4 rounded-full transition-colors ${
                tapIndex === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
