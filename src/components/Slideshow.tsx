import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { GalleryItem, MediaItem } from "@/lib/gallery";

interface SlideshowProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export function Slideshow({ item, onClose }: SlideshowProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dir, setDir] = useState<1 | -1>(1);

  // Reset state when a new gallery item (occasion) is opened
  useEffect(() => {
    if (item) {
      setIndex(0);
      setPlaying(true);
      setDir(1);
    }
  }, [item]);

  const next = useCallback(() => {
    if (!item || !item.images.length) return;
    setDir(1);
    setIndex((i) => (i + 1) % item.images.length);
  }, [item]);

  const prev = useCallback(() => {
    if (!item || !item.images.length) return;
    setDir(-1);
    setIndex((i) => (i - 1 + item.images.length) % item.images.length);
  }, [item]);

  // Lock scrolling on document body
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, next, prev, onClose]);

  // Auto-scroll loop for images (suspended if video is currently playing)
  useEffect(() => {
    if (!item || !playing || !item.images.length) return;
    
    const activeMedia = item.images[index];
    // If it's a video, don't use timeout auto-scroll; wait for the video to end
    if (activeMedia?.type === "video") return;

    const t = window.setTimeout(next, 4000);
    return () => window.clearTimeout(t);
  }, [item, playing, index, next]);

  const activeMedia = item?.images[index];

  return (
    <AnimatePresence>
      {item && activeMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[80] bg-black flex flex-col justify-between"
        >
          {/* Main Slide Viewer */}
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              {activeMedia.type === "video" ? (
                <motion.div
                  key={activeMedia.id + "-" + index}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40, scale: 1.02 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -dir * 40, scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full flex items-center justify-center"
                >
                  <video
                    src={activeMedia.url}
                    className="h-full w-full object-contain"
                    controls
                    autoPlay
                    playsInline
                    onEnded={next}
                  />
                </motion.div>
              ) : (
                <motion.img
                  key={activeMedia.id + "-" + index}
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40, scale: 1.02 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -dir * 40, scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Vignette overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />

          {/* Top Bar Navigation */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 px-4 pt-4 md:px-8 md:pt-6">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {item.title}
              </p>
              <h2 className="text-lg font-bold text-white md:text-2xl">{activeMedia.title}</h2>
            </div>
            <div
              className="ml-auto text-xs tabular-nums md:text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              {index + 1} / {item.images.length}
            </div>
            {activeMedia.type !== "video" && (
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Prev / Next Buttons */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 md:left-6 md:h-14 md:w-14"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 md:right-6 md:h-14 md:w-14"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </button>

          {/* Bottom Caption & Thumbnail Nav */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-5 md:px-10 md:pb-8">
            <p className="mx-auto max-w-2xl text-center text-xs text-white/90 md:text-sm">
              {activeMedia.caption}{" "}
              <span style={{ color: "var(--meta)" }}>· {item.date}</span>
            </p>

            {/* Segmented progress indicators */}
            <div className="mx-auto mt-4 flex max-w-2xl gap-1">
              {item.images.map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20"
                >
                  <motion.div
                    className="h-full bg-white"
                    initial={false}
                    animate={{
                      width:
                        i < index
                          ? "100%"
                          : i === index
                            ? activeMedia.type === "video" || playing
                              ? "100%"
                              : "50%"
                            : "0%",
                    }}
                    transition={{
                      duration: i === index && playing && activeMedia.type !== "video" ? 4 : 0.2,
                      ease: "linear",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Thumbnails Navigation */}
            <div className="no-scrollbar mx-auto mt-4 flex max-w-3xl gap-2 overflow-x-auto pb-1">
              {item.images.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className="relative h-12 w-20 shrink-0 overflow-hidden rounded-sm md:h-14 md:w-24"
                  style={{
                    outline:
                      i === index
                        ? "2px solid var(--brand)"
                        : "1px solid rgba(255,255,255,0.15)",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  {it.type === "video" ? (
                    <div className="h-full w-full bg-[#181818] flex items-center justify-center text-[10px] text-white/80 opacity-80 hover:opacity-100 font-semibold uppercase">
                      Video
                    </div>
                  ) : (
                    <img
                      src={it.url}
                      alt=""
                      className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
                      loading="lazy"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
