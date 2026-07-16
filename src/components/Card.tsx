import { useState, useRef, useEffect } from "react";
import { motion as motionChild, AnimatePresence as FramerAnimatePresence } from "framer-motion";
import { Heart, Info, Plus, Play } from "lucide-react";
import type { GalleryItem, Layout } from "@/lib/gallery";

interface CardProps {
  item: GalleryItem;
  layout: Layout;
  onOpen: () => void;
  isMobile: boolean;
}

export function Card({ item, layout, onOpen, isMobile }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const aspect = layout === "portrait" ? "aspect-[2/3]" : "aspect-video";
  const isVideo = item.image.endsWith(".mp4");

  const beginHover = () => {
    if (isMobile) return;
    hoverTimer.current = window.setTimeout(() => setHovered(true), 450);
  };
  const endHover = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setHovered(false);
  };

  useEffect(
    () => () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    },
    [],
  );

  // Load video sources with a small delay to prioritize image downloads first
  useEffect(() => {
    if (isVideo) {
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isVideo]);

  return (
    <motionChild.div
      className="relative shrink-0"
      style={{
        width: isMobile ? 128 : layout === "portrait" ? 200 : 240,
      }}
      onMouseEnter={beginHover}
      onMouseLeave={endHover}
      onClick={onOpen}
    >
      <motionChild.div
        animate={
          hovered
            ? {
                scale: 1.35,
                zIndex: 40,
                boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
              }
            : { scale: 1, zIndex: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
        }
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative origin-center cursor-pointer overflow-hidden rounded-[4px] bg-[#2a2a2a] border border-white/5"
      >
        <div className={`relative ${aspect} w-full overflow-hidden`}>
          {!loaded && <div className="shimmer absolute inset-0 bg-[#333]" />}
          {isVideo ? (
            shouldLoadVideo ? (
              <video
                src={item.image}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedData={() => setLoaded(true)}
                className="h-full w-full object-cover transition-opacity duration-300"
                style={{ opacity: loaded ? 1 : 0 }}
              />
            ) : (
              <div className="absolute inset-0 bg-[#2a2a2a] shimmer" />
            )
          ) : (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className="h-full w-full object-cover transition-opacity duration-300"
              style={{ opacity: loaded ? 1 : 0 }}
            />
          )}
          {isVideo && (
            <div className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 p-1 text-white border border-white/10">
              <Play className="h-2.5 w-2.5 fill-white animate-pulse" />
            </div>
          )}
        </div>

        <FramerAnimatePresence>
          {hovered && !isMobile && (
            <motionChild.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, delay: 0.08 }}
              className="bg-[#181818] p-2.5"
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <IconBtn label="Favorite">
                  <Heart className="h-3 w-3" />
                </IconBtn>
                <IconBtn label="Add">
                  <Plus className="h-3 w-3" />
                </IconBtn>
                <IconBtn label="More info" className="ml-auto">
                  <Info className="h-3 w-3" />
                </IconBtn>
              </div>
              <p className="truncate text-[11px] font-semibold text-white">{item.title}</p>
              <p className="text-[10px]" style={{ color: "var(--meta)" }}>
                {item.date} · {item.images?.length || 0} {item.images?.length === 1 ? 'item' : 'items'}
              </p>
            </motionChild.div>
          )}
        </FramerAnimatePresence>
      </motionChild.div>
    </motionChild.div>
  );
}

function IconBtn({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className={`grid h-6 w-6 place-items-center rounded-full border border-white/50 text-white transition-colors hover:border-white ${className}`}
    >
      {children}
    </button>
  );
}
