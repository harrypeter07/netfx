import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import type { Featured } from "@/lib/gallery";

interface HeroProps {
  featured: Featured;
  onMoreInfo: () => void;
}

export function Hero({ featured, onMoreInfo }: HeroProps) {
  return (
    <section className="relative isolate h-[70vh] w-full md:h-[85vh]">
      <img
        src={featured.image}
        alt={featured.title}
        className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
        fetchPriority="high"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "var(--hero-fade)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex h-full max-w-full flex-col justify-end px-4 pb-16 md:max-w-[560px] md:px-12 md:pb-24"
      >
        <div className="mb-3 flex items-center gap-2">
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
        </div>

        <h1
          className="text-[36px] font-black leading-[1.05] tracking-tight text-white md:text-[64px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {featured.title}
        </h1>

        <p className="mt-3 max-w-[500px] text-sm leading-snug text-white/90 md:mt-4 md:text-lg">
          {featured.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 md:mt-6 md:gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/85 md:px-7 md:py-2.5 md:text-base"
            onClick={onMoreInfo}
          >
            <Play className="h-4 w-4 fill-black md:h-5 md:w-5" />
            View
          </button>
          <button
            onClick={onMoreInfo}
            className="inline-flex items-center gap-2 rounded-[4px] px-5 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 md:px-7 md:py-2.5 md:text-base"
            style={{ backgroundColor: "rgba(109,109,110,0.5)" }}
          >
            <Info className="h-4 w-4 md:h-5 md:w-5" />
            More Info
          </button>
        </div>
      </motion.div>
    </section>
  );
}
