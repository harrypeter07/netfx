import { useState, useEffect } from "react";

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

  // Check persisted session
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved === "chintu") setAuthed(true);
  }, []);

  const handleRoleSelect = () => {
    setStep("password");
    setError("");
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "chintu");
      setAuthed(true);
    } else {
      setError("Wrong password. Try again.");
      setPassword("");
      triggerShake();
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#141414] px-4 relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Subtle radial glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(229,9,20,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Brand wordmark */}
      <div className="mb-10 flex flex-col items-center">
        <span
          className="text-4xl font-black tracking-tight select-none"
          style={{
            color: "#E50914",
            letterSpacing: "-0.04em",
            fontFamily: "'Inter', sans-serif",
            textShadow: "0 0 30px rgba(229,9,20,0.4)",
          }}
        >
          GALLERY
        </span>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/30">
          Private Collection
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[360px] rounded-2xl border border-white/8 p-8"
        style={{
          background: "rgba(24,24,24,0.92)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {step === "role" ? (
          <>
            <h2
              className="text-xl font-bold text-white text-center mb-1"
              style={{ letterSpacing: "-0.02em" }}
            >
              Who's watching?
            </h2>
            <p className="text-center text-xs text-white/40 mb-8">
              Select your profile to continue
            </p>

            {/* Single profile card — "Chintu" */}
            <button
              onClick={handleRoleSelect}
              className="mx-auto flex flex-col items-center gap-3 group"
            >
              <div
                className="h-24 w-24 rounded-xl flex items-center justify-center text-3xl font-black text-white transition-all duration-200 group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#E50914]"
                style={{
                  background: "linear-gradient(135deg, #E50914 0%, #b81c1c 100%)",
                  boxShadow: "0 8px 32px rgba(229,9,20,0.35)",
                }}
              >
                C
              </div>
              <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">
                Chintu
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Back arrow + heading */}
            <button
              onClick={() => { setStep("role"); setPassword(""); setError(""); }}
              className="mb-6 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
              Back
            </button>

            {/* Mini avatar */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="h-14 w-14 rounded-lg flex items-center justify-center text-xl font-black text-white mb-2"
                style={{
                  background: "linear-gradient(135deg, #E50914 0%, #b81c1c 100%)",
                  boxShadow: "0 6px 20px rgba(229,9,20,0.3)",
                }}
              >
                C
              </div>
              <p className="text-sm font-semibold text-white">Chintu</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                className={`relative transition-transform ${shake ? "animate-[shake_0.4s_ease]" : ""}`}
                style={shake ? { animation: "shake 0.4s ease" } : {}}
              >
                <input
                  type={reveal ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Password"
                  autoFocus
                  className="w-full rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: error
                      ? "1px solid #E50914"
                      : "1px solid rgba(255,255,255,0.12)",
                    caretColor: "#E50914",
                  }}
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setReveal((r) => !r)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {reveal ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {error && (
                <p className="text-xs text-[#E50914] font-medium text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={!password}
                className="w-full rounded-lg py-3 text-sm font-bold text-white transition-all disabled:opacity-40"
                style={{
                  background: password
                    ? "linear-gradient(135deg, #E50914 0%, #c11119 100%)"
                    : "rgba(229,9,20,0.3)",
                  boxShadow: password ? "0 4px 20px rgba(229,9,20,0.4)" : "none",
                }}
              >
                Enter Gallery
              </button>
            </form>
          </>
        )}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-[10px] text-white/20 text-center">
        Private gallery · Access restricted
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
