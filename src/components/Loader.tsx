import { useState, useEffect, useRef } from "react";
import galleryData from "../data/gallery.json";

interface LoaderProps {
  onComplete: () => void;
}

// Collect every image URL from gallery.json (skip videos — they stream)
function collectImageUrls(): string[] {
  const urls = new Set<string>();

  const add = (url: string) => {
    if (url && !url.endsWith(".mp4") && !url.endsWith(".webm") && !url.endsWith(".mov")) {
      urls.add(url);
    }
  };

  // Featured
  if (galleryData.featured?.image) add(galleryData.featured.image);
  galleryData.featured?.images?.forEach((img: any) => add(img.url));

  // Albums
  galleryData.albums?.forEach((album: any) => {
    album.items?.forEach((item: any) => {
      if (item.image) add(item.image);
      item.images?.forEach((img: any) => add(img.url));
    });
  });

  return Array.from(urls);
}

const ALL_IMAGES = collectImageUrls();
const MIN_MS = 4000;   // always show loader for at least 4s
const MAX_MS = 15000;  // never wait more than 15s

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded]     = useState(0);
  const [done, setDone]         = useState(false);
  const [fadeOut, setFadeOut]   = useState(false);
  const startRef  = useRef(Date.now());
  const calledRef = useRef(false);
  const total     = ALL_IMAGES.length;

  // Kick off image preloading
  useEffect(() => {
    if (total === 0) { finish(); return; }

    let count = 0;
    const imgs = ALL_IMAGES.map((src) => {
      const img = new window.Image();
      img.onload  = () => { count++; setLoaded(count); };
      img.onerror = () => { count++; setLoaded(count); }; // count failures too
      img.src = src;
      return img;
    });

    // Hard cap — don't wait forever
    const cap = setTimeout(finish, MAX_MS);
    return () => {
      clearTimeout(cap);
      imgs.forEach((i) => { i.onload = null; i.onerror = null; });
    };
  }, []);

  // Update progress bar as images load
  useEffect(() => {
    if (total === 0) return;
    const raw = Math.round((loaded / total) * 100);
    setProgress(raw);
    if (loaded >= total) {
      const elapsed = Date.now() - startRef.current;
      const wait    = Math.max(0, MIN_MS - elapsed);
      setTimeout(finish, wait);
    }
  }, [loaded, total]);

  function finish() {
    if (calledRef.current) return;
    calledRef.current = true;
    setProgress(100);
    setDone(true);
    // Fade out, THEN tell parent
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 600);
    }, 300);
  }

  // Animated "ticking" progress even while waiting for images — feels alive
  useEffect(() => {
    // Slowly animate progress up to 85% independently, rest filled by real loads
    let fake = 0;
    const id = setInterval(() => {
      setProgress((prev) => {
        // Only nudge forward if we haven't hit real progress
        const realProgress = total > 0 ? Math.round((loaded / total) * 100) : 0;
        if (prev >= 95 || prev >= realProgress) return prev;
        fake += Math.random() * 1.2;
        return Math.min(prev + 0.8, 92);
      });
    }, 120);
    return () => clearInterval(id);
  }, [loaded, total]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      style={{
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Radial glow behind logo ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(229,9,20,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Logo ── */}
      <div className="relative flex flex-col items-center mb-16">
        {/* Animated shimmer ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 140,
            height: 140,
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(229,9,20,0.35) 30%, transparent 60%)",
            animation: "spin 2.5s linear infinite",
            filter: "blur(18px)",
          }}
        />

        {/* GALLERY wordmark */}
        <span
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(3rem, 10vw, 5.5rem)",
            color: "#E50914",
            letterSpacing: "0.06em",
            lineHeight: 1,
            userSelect: "none",
            textShadow: "0 0 60px rgba(229,9,20,0.5), 0 2px 4px rgba(0,0,0,0.8)",
            position: "relative",
          }}
        >
          GALLERY
        </span>

        {/* Subtitle */}
        <p
          className="mt-3 text-white/30 text-xs tracking-[0.3em] uppercase"
          style={{ letterSpacing: "0.28em" }}
        >
          Loading your memories
        </p>
      </div>

      {/* ── Three dot pulse ── */}
      <div className="flex gap-2 mb-16">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full bg-white/30"
            style={{
              width: 6,
              height: 6,
              animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Bottom progress bar (Netflix style) ── */}
      <div className="absolute bottom-0 left-0 w-full">
        {/* Track */}
        <div className="h-[3px] w-full bg-white/10" />
        {/* Fill */}
        <div
          className="h-[3px] absolute bottom-0 left-0"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #b81c1c 0%, #E50914 60%, #ff4d4d 100%)",
            transition: "width 0.3s ease",
            boxShadow: "0 0 12px rgba(229,9,20,0.8)",
          }}
        />
        {/* Glow head */}
        <div
          className="absolute bottom-0 h-[3px] w-8"
          style={{
            left: `calc(${progress}% - 2rem)`,
            background: "linear-gradient(90deg, transparent, #ff6666)",
            transition: "left 0.3s ease",
          }}
        />
      </div>

      {/* ── % counter in corner ── */}
      <div
        className="absolute bottom-5 right-5 text-white/20 tabular-nums"
        style={{ fontSize: "0.7rem", fontVariantNumeric: "tabular-nums" }}
      >
        {Math.min(progress, 100)}%
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
          40%            { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
