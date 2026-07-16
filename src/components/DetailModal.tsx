import { useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, Share2, Download, Play } from "lucide-react";
import type { GalleryItem } from "@/lib/gallery";
import { getAlbums } from "@/lib/gallery";

interface DetailModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onOpen: (item: GalleryItem) => void;
  isMobile: boolean;
}

export function DetailModal({ item, onClose, onOpen, isMobile }: DetailModalProps) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0.2]);

  useEffect(() => {
    if (item) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  const related = item
    ? (
        getAlbums().find((a) =>
          a.title.toLowerCase().startsWith(item.album.toLowerCase()),
        )?.items ?? []
      )
        .filter((i) => i.id !== item.id)
        .slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm md:items-center md:p-6"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0, y: isMobile ? 40 : 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            style={{ y: isMobile ? y : 0, opacity: isMobile ? opacity : 1 }}
            className="relative w-full max-w-[850px] overflow-hidden rounded-t-2xl bg-[#181818] md:rounded-md"
          >
            {isMobile && (
              <div className="sticky top-0 z-10 flex justify-center bg-[#181818] pt-2">
                <div className="h-1 w-10 rounded-full bg-white/30" />
              </div>
            )}

            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="aspect-video w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#181818] to-transparent" />
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8">
                <h2 className="text-2xl font-bold text-white md:text-4xl">{item.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-[4px] bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-white/85">
                    <Play className="h-4 w-4 fill-black" /> View
                  </button>
                  <IconBtn label="Favorite">
                    <Heart className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label="Share">
                    <Share2 className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label="Download">
                    <Download className="h-4 w-4" />
                  </IconBtn>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8">
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--meta)" }}>
                <span>{item.date}</span>
                <span>·</span>
                <span
                  className="rounded-sm border px-1.5 py-0.5 text-[10px] uppercase tracking-wider"
                  style={{ borderColor: "rgba(255,255,255,0.25)" }}
                >
                  {item.album}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/90 md:text-base">
                {item.description}
              </p>

              {related.length > 0 && (
                <div className="mt-8">
                  <h3
                    className="mb-3 text-base font-bold md:text-lg"
                    style={{ color: "var(--row-title)" }}
                  >
                    More from {item.album}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {related.map((r) => (
                      <button key={r.id} onClick={() => onOpen(r)} className="group text-left">
                        <div className="aspect-video overflow-hidden rounded-[4px] bg-[#2a2a2a]">
                          <img
                            src={r.image}
                            alt={r.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-1.5 truncate text-xs font-semibold text-white">
                          {r.title}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--meta)" }}>
                          {r.date}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/50 text-white transition-colors hover:border-white hover:bg-white/10"
    >
      {children}
    </button>
  );
}
