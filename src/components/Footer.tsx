import { getPerson } from "@/lib/gallery";

export function Footer() {
  const p = getPerson();
  return (
    <footer className="mt-10 bg-black px-4 py-10 md:px-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Questions? Say hi.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs md:grid-cols-4 md:gap-4 md:text-sm">
          {[
            "About",
            "Contact",
            "Prints",
            "Instagram",
            "Timeline",
            "Albums",
            "Favorites",
            "Press",
          ].map((l) => (
            <a
              key={l}
              href="#"
              className="hover:underline"
              style={{ color: "var(--muted-foreground)" }}
            >
              {l}
            </a>
          ))}
        </div>
        <p className="mt-8 text-[11px]" style={{ color: "var(--meta)" }}>
          © {new Date().getFullYear()} {p.name}. All photographs are personal work.
        </p>
      </div>
    </footer>
  );
}
