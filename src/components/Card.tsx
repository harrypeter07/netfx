import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Info, Plus } from "lucide-react";
import type { GalleryItem, Layout } from "@/lib/gallery";

interface CardProps {
  item: GalleryItem;
  layout: Layout;
  onOpen: (item: GalleryItem) => void;
  isMobile: boolean;
}

export function Card({ item, layout, onOpen, isMobile }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const aspect = layout === "portrait" ? "aspect-[2/3]" : "aspect-video";

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

  return (
    <motion.div
      className="relative shrink-0"
      style={{
        width: isMobile ? 128 : layout === "portrait" ? 200 : 240,
      }}
      onMouseEnter={beginHover}
      onMouseLeave={endHover}
      onClick={() => onOpen(item)}
    >
      <motion.div
        animate={
          hovered
            ? {
                scale: 1.4,
                zIndex: 40,
                boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
              }
            : { scale: 1, zIndex: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
        }
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative origin-center cursor-pointer overflow-hidden rounded-[4px] bg-[#2a2a2a]"
      >
        <div className={`relative ${aspect} w-full overflow-hidden`}>
          {!loaded && <div className="shimmer absolute inset-0" />}
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="h-full w-full object-cover"
          />
        </div>

        <AnimatePresence>
          {hovered && !isMobile && (
            <motion.div
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
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
