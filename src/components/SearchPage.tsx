import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchHeader from "./SearchHeader";
import SearchBySection from "./SearchBySection";
import { playTypes, formations } from "@/constants/playOptions";
import { Play } from "@/types/play";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import ReactPlayer from "react-player";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const SearchPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dropdownType, setDropdownType] = useState<
    "formation" | "playType" | null
  >(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [plays, setPlays] = useState<Play[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<string | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragMoved, setDragMoved] = useState(false);
  const [selectedPlayType, setSelectedPlayType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [cookies] = useCookies(["authToken"]);

  const token = cookies.authToken;

  const fetchPlays = async (formation: string, playType: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/plays?formation=${formation}&play_type=${playType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  useEffect(() => {
    fetchPlays(selectedFormation, selectedPlayType);
  }, [selectedFormation, selectedPlayType]);

  const handleDropdownClick = (
    type: "formation" | "playType",
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    const dropdownHeight = 144;
    const footerHeight = 90;
    const padding = 8;
    const viewportHeight = window.innerHeight;

    let top = e.pageY;
    if (top + dropdownHeight + footerHeight > viewportHeight) {
      top = top - dropdownHeight;
    }

    const left = type === "formation" ? e.pageX : e.pageX - 176;

    setDropdownPosition({ x: left, y: top });
    setDropdownType(type);
  };

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

  const currentPlay = plays[currentIndex];

  useEffect(() => {
    const handleOutsideClick = () => {
      setDropdownType(null);
    };

    if (dropdownType) {
      window.addEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownType]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p className="text-lg">Loading plays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-w-sm w-full mx-auto flex flex-col justify-start items-center overflow-hidden relative">
      <div className="flex justify-center items-center gap-4 p-2 w-full absolute top-20 z-50">
        <div
          className="cursor-pointer w-1/2 bg-white rounded-lg p-6 flex items-center justify-center min-h-[80px] relative transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-gray-200"
          onClick={(e) => handleDropdownClick("formation", e)}
        >
          <p className="text-black text-sm font-bold">
            {selectedFormation ? selectedFormation : "Formation"}
          </p>
        </div>
        <div
          className="cursor-pointer w-1/2 bg-white rounded-lg p-6 flex items-center justify-center min-h-[80px] relative transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-gray-200"
          onClick={(e) => handleDropdownClick("playType", e)}
        >
          <p className="text-black text-sm font-bold">
            {selectedPlayType ? selectedPlayType : "Play Type"}
          </p>
        </div>
      </div>

      <div className="h-screen w-full flex flex-col gap-3 justify-center items-center">
        <div className="w-full h-full relative flex items-center justify-center">
          <div
            ref={scrollContainerRef}
            className="h-screen w-full overflow-y-auto hide-scrollbar snap-y snap-mandatory"
          >
            {plays.length > 0 ? (
              plays.map((play, index) => (
                <div
                  key={play.id}
                  className="w-full h-screen snap-start flex relative justify-center items-center"
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
                </div>
              ))
            ) : (
              <div className="flex flex-1 w-full h-full justify-center items-center">
                <h2
                  className="text-xl font-normal text-white mb-4 relative pt-20"
                  style={{
                    fontFamily: "Georgia, serif",
                    textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                    transform: "rotate(-1deg)",
                  }}
                >
                  There is no matched video.
                </h2>
              </div>
            )}
          </div>
        </div>

        {currentPlay && (
          <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-50">
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
                {currentPlay?.tags.map((tag, index) => (
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

      {dropdownType && dropdownPosition && (
        <>
          <div
            className="fixed z-50 w-44 overflow-y-auto bg-white rounded shadow-lg border border-gray-300"
            style={{
              top: dropdownPosition.y,
              left: dropdownPosition.x,
            }}
            onClick={() => setDropdownType(null)}
          >
            {[
              {
                label:
                  dropdownType === "formation"
                    ? "Select Formation"
                    : "Select Play Type",
                value: "",
              },
              ...(dropdownType === "formation" ? formations : playTypes),
            ].map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const value = item.value;
                  setDropdownType(null);

                  if (!value) {
                    if (dropdownType === "formation") {
                      setSelectedFormation("");

                      fetchPlays("", "");
                    } else if (dropdownType === "playType") {
                      setSelectedPlayType("");

                      fetchPlays(selectedFormation, "");
                    }
                    return;
                  }

                  if (dropdownType === "formation") {
                    setSelectedFormation(value);
                    fetchPlays(value, selectedPlayType || "");
                  } else if (dropdownType === "playType") {
                    setSelectedPlayType(value);
                    if (selectedFormation) {
                      fetchPlays(selectedFormation, value);
                    }
                  }
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
