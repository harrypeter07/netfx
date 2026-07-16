import { useState, useEffect, useRef } from "react";

const PASSWORD = import.meta.env.VITE_GALLERY_PASSWORD ?? "chintu15";
const SESSION_KEY = "gallery_auth_role";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [authed, setAuthed] = useState(false);
  const [step, setStep] = useState<"role" | "password">("role");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [reveal, setReveal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved === "chintu") setAuthed(true);
  }, []);

  useEffect(() => {
    if (step === "password") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [step]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "chintu");
      setAuthed(true);
    } else {
      setError("Incorrect password.");
      setPassword("");
      triggerShake();
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-black"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* ── Top bar ── */}
      <div className="w-full flex items-center justify-between px-8 pt-6 pb-0">
        {/* Brand logo — Netflix-style condensed bold */}
        <div className="flex-1" />
        <span
          style={{
            fontFamily: "'Bebas Neue', 'Arial Narrow', Impact, sans-serif",
            fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
            color: "#E50914",
            letterSpacing: "0.04em",
            lineHeight: 1,
            userSelect: "none",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          GALLERY
        </span>
        <div className="flex-1 flex justify-end">
          {step === "role" && (
            <button
              className="text-white/50 hover:text-white/80 transition-colors"
              aria-label="Manage profiles"
              tabIndex={-1}
            >
              {/* Pencil icon */}
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Role selection ── */}
      {step === "role" && (
        <div className="flex flex-col items-center flex-1 justify-center pb-20">
          <h1
            className="text-white font-bold text-center mb-10"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", letterSpacing: "-0.01em" }}
          >
            Who's Watching?
          </h1>

          {/* Single profile — Chintu */}
          <button
            onClick={() => { setStep("password"); setError(""); }}
            className="flex flex-col items-center gap-3 group focus:outline-none"
          >
            {/* Avatar square */}
            <div
              className="relative overflow-hidden transition-all duration-200 group-hover:ring-4 group-hover:ring-white group-focus:ring-4 group-focus:ring-white"
              style={{
                width: "clamp(100px, 18vw, 150px)",
                height: "clamp(100px, 18vw, 150px)",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #2563EB 0%, #1e40af 40%, #1d4ed8 100%)",
              }}
            >
              {/* Smiley face SVG — same style as Netflix */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                style={{ padding: "18%" }}
              >
                {/* Eyes */}
                <circle cx="35" cy="38" r="7" fill="white" />
                <circle cx="65" cy="38" r="7" fill="white" />
                {/* Smile */}
                <path
                  d="M 25 58 Q 50 80 75 58"
                  fill="none"
                  stroke="white"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Name */}
            <span
              className="text-white/70 group-hover:text-white transition-colors font-medium"
              style={{ fontSize: "0.95rem", letterSpacing: "0.01em" }}
            >
              Chintu
            </span>
          </button>
        </div>
      )}

      {/* ── Password entry ── */}
      {step === "password" && (
        <div className="flex flex-col items-center flex-1 justify-center pb-20 w-full px-4">
          {/* Mini profile */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative overflow-hidden mb-3"
              style={{
                width: 80,
                height: 80,
                borderRadius: "5px",
                background: "linear-gradient(135deg, #2563EB 0%, #1e40af 40%, #1d4ed8 100%)",
              }}
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ padding: "18%" }}>
                <circle cx="35" cy="38" r="7" fill="white" />
                <circle cx="65" cy="38" r="7" fill="white" />
                <path d="M 25 58 Q 50 80 75 58" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white font-semibold text-base">Chintu</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[340px] flex flex-col gap-3"
            style={shake ? { animation: "shake 0.5s ease" } : {}}
          >
            <div className="relative">
              <input
                ref={inputRef}
                type={reveal ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Password"
                className="w-full px-4 py-3.5 pr-12 text-sm text-white placeholder-white/30 rounded"
                style={{
                  background: "rgba(60,60,60,0.75)",
                  border: error ? "1.5px solid #E50914" : "1.5px solid rgba(128,128,128,0.5)",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => setReveal(r => !r)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                tabIndex={-1}
              >
                {reveal ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p className="text-[#E50914] text-xs font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={!password}
              className="w-full py-3.5 rounded text-sm font-bold text-white transition-all"
              style={{
                background: "#E50914",
                opacity: password ? 1 : 0.5,
                letterSpacing: "0.05em",
              }}
            >
              SIGN IN
            </button>

            <button
              type="button"
              onClick={() => { setStep("role"); setPassword(""); setError(""); }}
              className="text-center text-sm text-white/50 hover:text-white/80 transition-colors mt-1"
            >
              ← Back to profiles
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
