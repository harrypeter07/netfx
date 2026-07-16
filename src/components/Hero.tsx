import { Play, Info } from "lucide-react";
import type { Featured } from "@/lib/gallery";

interface HeroProps {
  featured: Featured;
  onMoreInfo: () => void;
  onVideoEnded?: () => void;
}

export function Hero({ featured, onMoreInfo, onVideoEnded }: HeroProps) {
  const isVideo = featured.image.endsWith(".mp4");

  return (
    <section className="relative isolate min-h-[70vh] sm:min-h-[85vh] w-full flex flex-col justify-end pb-12 pt-40 px-4 sm:px-12 overflow-hidden bg-black">
      {/* Background Media Container */}
      <div className="absolute inset-0 -z-10">
        {isVideo ? (
          <video
            key={featured.image}
            src={featured.image}
            autoPlay
            muted
            playsInline
            onEnded={onVideoEnded}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            key={featured.image}
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover object-[center_25%]"
            fetchPriority="high"
          />
        )}

        {/* Cinematic dark overlays to make text highly readable */}
        <div className="absolute inset-0 bg-black/45 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent hidden md:block z-20" />
      </div>

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
