import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useToast } from "@/hooks/use-toast";
import { Image } from "antd";
import ReactPlayer from "react-player";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Playbook = () => {
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["authToken"]);
  const { toast } = useToast();

  const [flattenedPlays, setFlattenedPlays] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragMoved, setDragMoved] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTargetIndexRef = useRef<number | null>(null);

  const token = cookies.authToken;

  const handleSwipe = (direction: "up" | "down") => {
    if (scrollTargetIndexRef.current !== null) return;

    setIsPlaying(false);
    let nextIndex = currentIndex;
    if (direction === "up" && currentIndex < flattenedPlays.length - 1) {
      nextIndex += 1;
    } else if (direction === "down" && currentIndex > 0) {
      nextIndex -= 1;
    }

    if (nextIndex !== currentIndex) {
      scrollTargetIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
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
        let newIndex = Math.round(scrollTop / screenHeight);
        newIndex = Math.max(0, Math.min(newIndex, flattenedPlays.length - 1));

        if (scrollTargetIndexRef.current !== null) {
          const expectedTop = scrollTargetIndexRef.current * screenHeight;
          if (Math.abs(expectedTop - scrollTop) < 2) {
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
    container.scrollTo({
      top: currentIndex * window.innerHeight,
      behavior: "smooth",
    });
  }, [currentIndex]);

  useEffect(() => {
    const fetchPlays = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/user_playbook`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) throw new Error();

        const grouped = result.grouped_plays || {};
        const flat: any[] = [];
        for (const [formation, data] of Object.entries(grouped)) {
          (data as any).plays.forEach((play: any) => {
            flat.push({ ...play, formationDiagram: (data as any).diagramUrl });
          });
        }
        setFlattenedPlays(flat);
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
    fetchPlays();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        Loading Playbook...
      </div>
    );
  }

  const currentPlay = flattenedPlays[currentIndex];

  return (
    <div className="h-screen flex flex-col justify-center overflow-hidden relative">
      <div className="relative overflow-hidden h-full">
        {currentPlay?.formationDiagram && (
          <div className="absolute top-16 right-0 z-50">
            <p className="text-white text-center text-lg font-bold">
              {currentPlay.formation}
            </p>
            <Image
              src={currentPlay.formationDiagram}
              alt="Formation Diagram"
              width={120}
              height={80}
              style={{ objectFit: "contain" }}
              preview={{ maskClassName: "bg-white/20" }}
            />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className={`flex-1 h-full w-full overflow-y-auto hide-scrollbar snap-y snap-mandatory ${
            isDragging ? "select-none" : ""
          }`}
        >
          {flattenedPlays.map((play, index) => (
            <div
              key={play.id}
              className="w-full h-screen snap-start"
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
              <div className="w-full h-full flex justify-center items-center relative">
                {index === currentIndex && (
                  <ReactPlayer
                    url={play.video_url}
                    playing={isPlaying}
                    loop
                    muted
                    controls={false}
                    width="100%"
                    height="100%"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                    onClick={() => setIsPlaying((prev) => !prev)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playbook;
