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
    <section className="relative isolate min-h-[80vh] sm:min-h-[90vh] w-full flex flex-col justify-end pb-12 pt-20 px-4 sm:px-12 overflow-hidden">
      {/* Full-bleed background media directly in hero */}
      <div className="absolute inset-0 -z-20">
        {isVideo ? (
          <video
            key={featured.image}
            src={featured.image}
            autoPlay
            muted
            playsInline
            loop
            onEnded={onVideoEnded}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            key={featured.image}
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover object-top"
            fetchPriority="high"
          />
        )}
      </div>

      {/* Gradient overlay: transparent at top, dark at bottom for card rows */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      {/* Hero Content Left Aligned */}
      <div className="relative z-30 max-w-xl w-full text-left">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white border-white/40">
            {featured.year}
          </span>
          <span className="rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white border-white/40">
            HD
          </span>
          <span className="rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {featured.tag || "Featured"}
          </span>
        </div>

        <h1
          className="text-[36px] font-black leading-tight tracking-tight text-white sm:text-[60px] drop-shadow-lg"
          style={{ letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          {featured.title}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-white/90 max-w-md sm:text-base drop-shadow-md">
          {featured.description}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-[4px] bg-white px-6 py-2.5 text-xs font-bold text-black transition-colors hover:bg-white/85 sm:text-sm sm:px-8 sm:py-3"
            onClick={onMoreInfo}
          >
            <Play className="h-4 w-4 fill-black" />
            Play
          </button>
          <button
            onClick={onMoreInfo}
            className="inline-flex items-center gap-2 rounded-[4px] px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:text-sm sm:px-8 sm:py-3"
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
