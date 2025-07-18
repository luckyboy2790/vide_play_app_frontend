import { useState, useEffect, useRef } from "react";
import { MessageCircle, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Play } from "@/types/play";
import { useCookies } from "react-cookie";
import ReactPlayer from "react-player";
import { LuBookmark } from "react-icons/lu";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const HomeFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
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
    setIsPlaying(false);
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

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user_playbook`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          play_id: parseInt(plays[currentIndex].id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      toast({
        title: "Play saved!",
        description: "Your play has been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Error saving play",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const currentPlay = plays[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
    setDragMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY !== null && !dragMoved) {
      const deltaY = e.touches[0].clientY - dragStartY;
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) handleSwipe("down");
        else handleSwipe("up");
        setDragMoved(true);
      }
    }
  };

  const handleTouchEnd = () => {
    setDragStartY(null);
    setDragMoved(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartY(e.clientY);
    setDragMoved(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartY !== null && !dragMoved) {
      const deltaY = e.clientY - dragStartY;
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) handleSwipe("down");
        else handleSwipe("up");
        setDragMoved(true);
      }
    }
  };

  const handlePointerUp = () => {
    setDragStartY(null);
    setDragMoved(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="text-white text-center">
          <p className="text-lg">Loading plays...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-full overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900`}
    >
      <header className="z-20 px-4 py-3 bg-transparent absolute w-full top-0 left-0">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <button className="text-white font-bold text-lg border-b-2 border-white pb-1">
              Home Page
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

      <div
        ref={scrollContainerRef}
        className="h-screen w-full overflow-y-auto hide-scrollbar snap-y snap-mandatory"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {plays.length > 0 ? (
          plays.map((play, index) => (
            <div
              key={play.id}
              className="w-full h-screen snap-start flex relative justify-center items-center"
            >
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  {index === currentIndex && (
                    <ReactPlayer
                      url={play.video_url}
                      playing={isPlaying}
                      loop
                      controls={false}
                      muted={false}
                      width="100%"
                      height="100%"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        objectFit: "cover",
                      }}
                      onClick={() => {
                        setIsPlaying((prev) => !prev);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col h-full">
            <div className="h-full flex items-center justify-center bg-black">
              <div className="text-white text-center">
                <p className="text-lg">No plays available</p>
                <p className="text-sm opacity-75 mt-2">
                  Create your first play to get started!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {currentPlay && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-50">
          <div
            className="absolute w-10 h-10 right-1 z-50 top-5"
            onClick={handleSave}
          >
            <LuBookmark className="size-6 cursor-pointer text-white" />
          </div>

          <div className="mb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {currentPlay?.play_type && (
                <div className="mt-2 h-7 flex justify-center items-center px-3 py-1 bg-green-600 rounded-full text-xs font-medium">
                  {currentPlay?.play_type.toUpperCase()}
                </div>
              )}
              {currentPlay?.formation && (
                <div className="mt-2 h-7 flex justify-center items-center px-3 py-1 bg-blue-600 rounded-full text-xs font-medium ml-2">
                  {currentPlay?.formation.toUpperCase()}
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
                Original sound - {currentPlay?.source}
              </span>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default HomeFeed;
