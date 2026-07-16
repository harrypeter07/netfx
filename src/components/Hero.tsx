import { Info, Play } from "lucide-react";
import type { Featured } from "@/lib/gallery";

interface HeroProps {
  featured: Featured;
  onMoreInfo: () => void;
  onVideoEnded?: () => void;
}

export function Hero({ featured, onMoreInfo, onVideoEnded }: HeroProps) {
  const isVideo = featured.image.endsWith(".mp4");

  return (
    <section className="relative w-full flex flex-col md:flex-row items-stretch">
      {/* Portrait image / video — natural height, constrained width */}
      <div className="relative flex-shrink-0 w-full md:w-[420px] lg:w-[480px] xl:w-[520px] self-stretch">
        {isVideo ? (
          <video
            key={featured.image}
            src={featured.image}
            autoPlay
            muted
            playsInline
            loop
            onEnded={onVideoEnded}
            className="w-full h-auto block"
            style={{ maxHeight: "100vh" }}
          />
        ) : (
          <img
            key={featured.image}
            src={featured.image}
            alt={featured.title}
            className="w-full h-auto block"
            fetchPriority="high"
          />
        )}

        {/* Bottom gradient so text is readable */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Text panel — sits to the right on desktop, below on mobile */}
      <div className="flex flex-col justify-end p-6 md:p-10 md:flex-1 bg-gradient-to-r from-black/70 via-black/50 to-transparent md:bg-none">
        {/* On desktop this panel is actually overlaid absolutely on left */}
        <div className="max-w-lg">
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
            className="text-[42px] font-black leading-none text-white sm:text-[68px] drop-shadow-lg"
            style={{
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              letterSpacing: "0.01em",
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}
          >
            {featured.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base max-w-sm drop-shadow-md">
            {featured.description}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2 text-xs font-bold text-black hover:bg-white/85 sm:text-sm sm:px-7 sm:py-2.5"
              onClick={onMoreInfo}
            >
              <Play className="h-4 w-4 fill-black" />
              Play
            </button>
            <button
              onClick={onMoreInfo}
              className="inline-flex items-center gap-2 rounded-[4px] px-5 py-2 text-xs font-semibold text-white hover:bg-white/20 sm:text-sm sm:px-7 sm:py-2.5"
              style={{ backgroundColor: "rgba(109,109,110,0.5)" }}
            >
              <Info className="h-4 w-4" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
