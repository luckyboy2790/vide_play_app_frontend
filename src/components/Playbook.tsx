import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import ReactPlayer from "react-player";
import { playTypes, formations } from "@/constants/playOptions";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const IMG_URL = import.meta.env.VITE_IMAGE_URL;

const Playbook = () => {
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["authToken"]);
  const { toast } = useToast();

  const [flattenedPlays, setFlattenedPlays] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragMoved, setDragMoved] = useState(false);
  const [dropdownType, setDropdownType] = useState<
    "formation" | "playType" | null
  >(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTargetIndexRef = useRef<number | null>(null);

  const [playOfDay, setPlayOfDay] = useState<any | null>(null);

  const [selectedFormation, setSelectedFormation] = useState<string | null>(
    null
  );
  const [selectedPlayType, setSelectedPlayType] = useState<string | null>(null);

  const token = cookies.authToken;

  const handleSwipe = (direction: "left" | "right") => {
    if (scrollTargetIndexRef.current !== null) return;

    setIsPlaying(false);
    let nextIndex = currentIndex;
    if (direction === "left" && currentIndex < flattenedPlays.length - 1) {
      nextIndex += 1;
    } else if (direction === "right" && currentIndex > 0) {
      nextIndex -= 1;
    }

    if (nextIndex !== currentIndex) {
      scrollTargetIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleSwipe("left");
      if (e.key === "ArrowLeft") handleSwipe("right");
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
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        let newIndex = Math.round(scrollLeft / containerWidth);
        newIndex = Math.max(0, Math.min(newIndex, flattenedPlays.length - 1));

        if (scrollTargetIndexRef.current !== null) {
          const expectedLeft = scrollTargetIndexRef.current * containerWidth;
          if (Math.abs(expectedLeft - scrollLeft) < 2) {
            scrollTargetIndexRef.current = null;
          } else return;
        }

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
  }, [currentIndex, flattenedPlays.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    container.scrollTo({
      left: currentIndex * width,
      behavior: "smooth",
    });
  }, [currentIndex]);

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

  const fetchPlays = async (formation: string, playType: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/user_playbook?formation=${formation}&playType=${playType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error();

      const diagramUrl = result.diagramUrl;
      const plays = result.plays || [];

      const flat = plays.map((play: any) => ({
        ...play,
        formationDiagram: diagramUrl,
      }));

      setFlattenedPlays(flat);
      setCurrentIndex(0); // reset to first video
    } catch {
      toast({
        title: "Error",
        description: "Could not load plays.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlayOfDay = async () => {
      const response = await fetch(`${API_URL}/api/plays/video_of_day`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      console.log(result);

      setPlayOfDay(result.play);
    };

    fetchPlayOfDay();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        Loading Playbook...
      </div>
    );
  }

  return (
    <div className="h-screen max-w-sm w-full mx-auto flex flex-col justify-start items-center overflow-hidden relative">
      <h2
        className="text-3xl font-bold text-white mb-4 relative pt-20"
        style={{
          fontFamily: "Georgia, serif",
          textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
          transform: "rotate(-1deg)",
        }}
      >
        PLAY OF THE DAY
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-white opacity-70 rounded-full"
          style={{ transform: "translateX(-50%) rotate(1deg)" }}
        ></div>
      </h2>
      {selectedFormation !== null && selectedFormation !== "" ? (
        <div className="relative overflow-hidden w-full h-full flex flex-col justify-between items-center">
          {selectedFormation && (
            <div className="z-50">
              <img
                src={`${IMG_URL}/formation-diagrams/${selectedFormation}.png`}
                alt="Formation Diagram"
                width="100%"
                height="auto"
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className={`flex flex-1 w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory ${
              isDragging ? "select-none" : ""
            }`}
          >
            {flattenedPlays.length > 0 ? (
              flattenedPlays.map((play, index) => (
                <div
                  key={play.id}
                  className="h-full w-full flex-shrink-0 snap-start"
                  onPointerDown={(e) => {
                    setDragStartX(e.clientX);
                    setDragMoved(false);
                    setIsDragging(true);
                  }}
                  onPointerMove={(e) => {
                    if (dragStartX !== null && !dragMoved) {
                      const deltaX = e.clientX - dragStartX;
                      if (Math.abs(deltaX) > 50) {
                        if (deltaX > 0) handleSwipe("right");
                        else handleSwipe("left");
                        setDragMoved(true);
                      }
                    }
                  }}
                  onPointerUp={() => {
                    setDragStartX(null);
                    setDragMoved(false);
                    setIsDragging(false);
                  }}
                >
                  <div className="w-full h-full flex justify-center items-center relative">
                    {index === currentIndex && (
                      <ReactPlayer
                        url={play.video_url}
                        playing={isPlaying}
                        controls={false}
                        muted={false}
                        loop
                        width="100%"
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                        onClick={() => setIsPlaying((prev) => !prev)}
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-1 w-full justify-center items-center">
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
      ) : (
        <div className="py-4 w-full">
          <div
            className="bg-black w-full rounded-lg overflow-hidden mb-6 relative border-4 border-white border-opacity-80 shadow-2xl"
            style={{
              boxShadow:
                "inset 0 0 20px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            <ReactPlayer
              url={playOfDay?.video_url}
              playing={false}
              controls={false}
              muted={false}
              loop
              width="100%"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        </div>
      )}

      <h2
        className="text-2xl font-bold text-white mb-4 relative"
        style={{
          fontFamily: "Georgia, serif",
          textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
          transform: "rotate(-1deg)",
        }}
      >
        View All Saved Plays
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-white opacity-70 rounded-full"
          style={{ transform: "translateX(-50%) rotate(1deg)" }}
        ></div>
      </h2>
      <div className="flex justify-center items-center gap-4 p-2 pb-24 mb-2 w-full">
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

      {dropdownType && dropdownPosition && (
        <>
          <div
            className="fixed z-50 h-36 w-44 overflow-y-auto bg-white rounded shadow-lg border border-gray-300"
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

                      setSelectedPlayType("");

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

export default Playbook;
