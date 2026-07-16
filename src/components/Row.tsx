import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Album, GalleryItem } from "@/lib/gallery";
import { Card } from "./Card";

interface RowProps {
  album: Album;
  onOpen: (item: GalleryItem) => void;
  isMobile: boolean;
  autoScroll?: boolean;
}

export function Row({ album, onOpen, isMobile, autoScroll = false }: RowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Auto-scroll marquee: seamlessly loop by using duplicated items and
  // wrapping scrollLeft when we cross the halfway point.
  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const speed = 30; // px / sec
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        el.scrollLeft += speed * dt;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoScroll, paused]);

  const items = autoScroll ? [...album.items, ...album.items] : album.items;

  return (
    <section
      className="relative py-4 md:py-6"
      onMouseEnter={() => {
        setHovered(true);
        setPaused(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setPaused(false);
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <h2
        className="mb-2 px-4 text-base font-bold md:mb-3 md:px-12 md:text-[22px]"
        style={{ color: "var(--row-title)" }}
      >
        {album.title}
      </h2>

      <div className="relative">
        {!isMobile && !autoScroll && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="absolute left-0 top-0 z-30 hidden h-full w-12 items-center justify-center bg-black/40 text-white transition-opacity hover:bg-black/60 md:flex"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}

        <motion.div
          ref={scrollerRef}
          className="no-scrollbar touch-scroll flex gap-2 overflow-x-scroll px-4 md:gap-1.5 md:px-12"
          style={{
            scrollSnapType: isMobile && !autoScroll ? "x mandatory" : "none",
            scrollBehavior: autoScroll ? "auto" : "smooth",
            paddingRight: isMobile ? "3rem" : "6rem",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {items.map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              style={{
                scrollSnapAlign: isMobile && !autoScroll ? "start" : "none",
              }}
            >
              <Card
                item={item}
                layout={album.layout}
                onOpen={onOpen}
                isMobile={isMobile}
              />
            </motion.div>
          ))}
        </motion.div>

        {!isMobile && !autoScroll && (
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="absolute right-0 top-0 z-30 hidden h-full w-12 items-center justify-center bg-black/40 text-white transition-opacity hover:bg-black/60 md:flex"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}
      </div>
    </section>
  );
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);
  return isMobile;
}
