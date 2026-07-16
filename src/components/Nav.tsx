import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { getPerson } from "@/lib/gallery";

const NAV_LINKS = ["Home", "Albums", "Timeline", "Favorites", "Recently Added"];

export function Nav() {
  const person = getPerson();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? "#141414" : "transparent",
          backgroundImage: scrolled ? "none" : "var(--nav-gradient)",
        }}
      >
        <div className="flex h-14 items-center gap-4 px-4 md:h-16 md:px-12">
          <a
            href="/"
            className="text-2xl font-black tracking-tight md:text-3xl"
            style={{ color: "var(--brand)" }}
            aria-label={`${person.name} home`}
          >
            {person.initial}
          </a>

          <nav className="ml-6 hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l}
                href="#"
                className="text-sm font-normal transition-colors hover:text-muted-foreground"
                style={{ color: i === 0 ? "#fff" : "#e5e5e5" }}
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 md:gap-5">
            <div className="flex items-center">
              <AnimatePresence initial={false}>
                {searchOpen && (
                  <motion.input
                    key="search"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    autoFocus
                    placeholder="Titles, people…"
                    className="mr-2 h-9 rounded-sm border border-white/40 bg-black/70 px-2 text-sm text-white outline-none placeholder:text-white/50"
                  />
                )}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Search"
                className="grid h-11 w-11 place-items-center text-white"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div
              className="hidden h-8 w-8 shrink-0 place-items-center rounded-sm text-sm font-bold text-white md:grid"
              style={{ backgroundColor: "var(--brand)" }}
              aria-label="Profile"
            >
              {person.initial}
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center text-white md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-4/5 max-w-xs flex-col bg-[#141414] p-6"
            >
              <div className="flex items-center justify-between">
                <div
                  className="grid h-8 w-8 place-items-center rounded-sm text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  {person.initial}
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l}
                    href="#"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-sm py-3 text-base font-semibold text-white/90 hover:bg-white/5"
                  >
                    {l}
                  </a>
                ))}
              </nav>
              <p className="mt-auto text-xs" style={{ color: "var(--meta)" }}>
                {person.name}
              </p>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
