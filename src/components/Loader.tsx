import { useState, useEffect, useRef } from "react";
import { onPreloadProgress } from "../lib/preloader";

interface LoaderProps {
  onComplete: () => void;
}

const MIN_MS = 4000; // always show for at least 4s

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut]   = useState(false);
  const startRef  = useRef(Date.now());
  const calledRef = useRef(false);

  function finish() {
    if (calledRef.current) return;
    calledRef.current = true;
    setProgress(100);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 600);
    }, 300);
  }

  // Subscribe to the shared background preloader progress
  useEffect(() => {
    const unsub = onPreloadProgress((pct) => {
      setProgress((prev) => Math.max(prev, pct)); // never go backwards
    });
    return unsub;
  }, []);

  // Always complete after MIN_MS — preloading continues in background after this
  useEffect(() => {
    const timer = setTimeout(finish, MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  // Smooth animated ticker — makes bar feel alive even before real loads arrive
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => {
        if (calledRef.current) return prev;
        if (prev >= 92) return prev;
        return Math.min(prev + 0.6 + Math.random() * 0.8, 92);
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

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
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(229,9,20,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div className="relative flex flex-col items-center mb-16">
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
        <p
          className="mt-3 text-white/30 text-xs uppercase"
          style={{ letterSpacing: "0.28em" }}
        >
          Loading your memories
        </p>
      </div>

      {/* Three dot pulse */}
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

      {/* Netflix-style bottom progress bar */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-[3px] w-full bg-white/10" />
        <div
          className="h-[3px] absolute bottom-0 left-0"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: "linear-gradient(90deg, #b81c1c 0%, #E50914 60%, #ff4d4d 100%)",
            transition: "width 0.25s ease",
            boxShadow: "0 0 12px rgba(229,9,20,0.8)",
          }}
        />
        <div
          className="absolute bottom-0 h-[3px] w-8"
          style={{
            left: `calc(${Math.min(progress, 100)}% - 2rem)`,
            background: "linear-gradient(90deg, transparent, #ff6666)",
            transition: "left 0.25s ease",
          }}
        />
      </div>

      {/* % counter */}
      <div
        className="absolute bottom-5 right-5 text-white/20"
        style={{ fontSize: "0.7rem", fontVariantNumeric: "tabular-nums" }}
      >
        {Math.min(Math.round(progress), 100)}%
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
