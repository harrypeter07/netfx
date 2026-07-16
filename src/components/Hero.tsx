import { Play, Info } from "lucide-react";
import type { Featured } from "@/lib/gallery";

interface HeroProps {
  featured: Featured;
  onMoreInfo: () => void;
}

export function Hero({ featured, onMoreInfo }: HeroProps) {
  return (
    <section className="relative isolate min-h-[60vh] sm:min-h-[75vh] w-full flex flex-col justify-end pb-12 pt-40 px-4 sm:px-12 overflow-hidden">
      {/* Dark overlay specifically for the text box on top of the global background */}
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-background via-background/20 to-transparent -z-10" />

      {/* Hero Content Left Aligned */}
      <div className="relative z-30 max-w-xl w-full text-left">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white border-white/40"
          >
            {featured.year}
          </span>
          <span
            className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white border-white/40"
          >
            HD
          </span>
          <span
            className="rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
          >
            {featured.tag || "Featured"}
          </span>
        </div>

        <h1
          className="text-[32px] font-black leading-tight tracking-tight text-white sm:text-[56px] drop-shadow-md"
          style={{ letterSpacing: "-0.02em" }}
        >
          {featured.title}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-white/95 max-w-md sm:text-base drop-shadow-sm">
          {featured.description}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[4px] bg-white px-6 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/85 sm:text-sm sm:px-8 sm:py-3"
            onClick={onMoreInfo}
          >
            <Play className="h-4 w-4 fill-black" />
            Play
          </button>
          <button
            onClick={onMoreInfo}
            className="inline-flex items-center gap-2 rounded-[4px] px-6 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:text-sm sm:px-8 sm:py-3"
            style={{ backgroundColor: "rgba(109,109,110,0.5)" }}
          >
            <Info className="h-4 w-4" />
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}
