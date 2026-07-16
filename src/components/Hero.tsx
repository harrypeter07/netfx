import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import type { Featured } from "@/lib/gallery";

interface HeroProps {
  featured: Featured;
  onMoreInfo: () => void;
}

export function Hero({ featured, onMoreInfo }: HeroProps) {
  return (
    <section className="relative isolate min-h-[85vh] w-full flex flex-col items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
      {/* Blurred background image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={featured.image}
          alt=""
          className="h-full w-full object-cover blur-3xl scale-110 opacity-30"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/50" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* Floating Portrait Poster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[2/3] w-48 xs:w-56 sm:w-64 overflow-hidden rounded-[8px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </motion.div>

        {/* Info & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "#e5e5e5" }}
            >
              {featured.year}
            </span>
            <span
              className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "#e5e5e5" }}
            >
              HD
            </span>
            <span
              className="rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            >
              Featured
            </span>
          </div>

          <h1
            className="text-[28px] font-black leading-tight tracking-tight text-white sm:text-[42px]"
            style={{ letterSpacing: "-0.01em" }}
          >
            {featured.title}
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-white/80 max-w-sm sm:text-sm">
            {featured.description}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-[4px] bg-white px-6 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/85 sm:text-sm sm:px-7 sm:py-2.5"
              onClick={onMoreInfo}
            >
              <Play className="h-3.5 w-3.5 fill-black sm:h-4 sm:w-4" />
              View
            </button>
            <button
              onClick={onMoreInfo}
              className="inline-flex items-center gap-2 rounded-[4px] px-6 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:text-sm sm:px-7 sm:py-2.5"
              style={{ backgroundColor: "rgba(109,109,110,0.5)" }}
            >
              <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              More Info
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
