import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Row, useIsMobile } from "@/components/Row";
import { Slideshow } from "@/components/Slideshow";
import { Footer } from "@/components/Footer";
import { getAlbums, resolveUrl, type GalleryItem } from "@/lib/gallery";

export const Route = createFileRoute("/")({
  component: Index,
});

const FEATURED_POOL = [
  {
    id: "evening_party_black_lehenga",
    title: "Wedding Festivities",
    description: "Capturing the elegance and grandeur of wedding celebrations, highlighting the beautiful traditional attire.",
    image: "/gallery/evening_party_black_lehenga_1.jpeg",
    year: "2024",
    tag: "Featured Showcase"
  },
  {
    id: "candid_home_pink_top",
    title: "Candid Home",
    description: "Quiet, peaceful moments captured in the warmth and comfort of home.",
    image: "/gallery/candid_home_pink_top_1.jpeg",
    year: "2025",
    tag: "Featured Showcase"
  },
  {
    id: "casual_outdoor_blue_kurti",
    title: "Casual Day Out",
    description: "Stepping out to enjoy the daylight in vibrant, simple, and comfortable outfits.",
    image: "/gallery/casual_outdoor_blue_kurti_2.jpeg",
    year: "2025",
    tag: "Featured Showcase"
  },
  {
    id: "video_clips_video",
    title: "Moment in Motion",
    description: "A beautiful memory captured dynamically in video.",
    image: "/gallery/video_clips_video_2.mp4",
    year: "2025",
    tag: "Featured Video"
  },
  {
    id: "video_clips_video",
    title: "Candid Laughter",
    description: "Capturing real emotion, smiles, and stories told in motion.",
    image: "/gallery/video_clips_video_7.mp4",
    year: "2025",
    tag: "Featured Video"
  }
];

function Index() {
  const albums = getAlbums();
  const isMobile = useIsMobile();
  
  // Pick a random featured item from the user's highlighted pool on mount
  const [featured] = useState(() => {
    const randomIndex = Math.floor(Math.random() * FEATURED_POOL.length);
    const item = FEATURED_POOL[randomIndex];
    return {
      ...item,
      image: resolveUrl(item.image)
    };
  });

  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const rawFeatured = FEATURED_POOL[currentFeaturedIndex];

  // Resolve ImageKit URLs dynamically
  const activeFeatured = {
    ...rawFeatured,
    image: resolveUrl(rawFeatured.image)
  };

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % FEATURED_POOL.length);
  };

  // Rotates images after 2 seconds (2000ms), wait for video ended for clips
  useEffect(() => {
    if (activeFeatured.image.endsWith(".mp4")) {
      return;
    }
    const timer = setTimeout(() => {
      nextFeatured();
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentFeaturedIndex, activeFeatured.image]);

  const [openItemState, setOpenItemState] = useState<GalleryItem | null>(null);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);

  const openItem = (occasion: GalleryItem, index: number) => {
    setOpenItemState(occasion);
    setSlideshowStartIndex(index);
  };

  const openFeaturedSlideshow = () => {
    const allMediaItems = albums.flatMap(a => a.items.flatMap(occ => occ.images));
    const filename = activeFeatured.image.split("/").pop();
    const matchIndex = allMediaItems.findIndex(img => img.url.endsWith(filename || ""));

    if (matchIndex !== -1) {
      // Find matching occasion
      const matchingOcc = albums
        .flatMap(a => a.items)
        .find(occ => occ.images.some(img => img.url.endsWith(filename || "")));
      if (matchingOcc) {
        const idxInOcc = matchingOcc.images.findIndex(img => img.url.endsWith(filename || ""));
        openItem(matchingOcc, idxInOcc !== -1 ? idxInOcc : 0);
        return;
      }
    }

    const first = albums[0]?.items[0];
    if (first) {
      openItem(first, 0);
    }
  };

  // Extract all unique shoot occasion items across all category albums (except "recent" to avoid duplicates)
  // Each occasion gets its own separate row, displaying its individual images/videos
  const occasions = albums
    .filter((a) => a.slug !== "recent")
    .flatMap((a) => a.items);

  return (
    <div className="min-h-screen bg-transparent text-foreground animate-fade-in relative">
      {/* Global Fixed Background (autoplay loop muted video or image covering entire page) */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#141414]">
        {activeFeatured.image.endsWith(".mp4") ? (
          <video
            key={activeFeatured.image}
            src={activeFeatured.image}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            key={activeFeatured.image}
            src={activeFeatured.image}
            alt=""
            className="h-full w-full object-cover object-[center_25%]"
          />
        )}
        {/* Cinematic dark overlay to ensure readability while displaying background */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
      </div>

      <Nav />

      <main>
        <Hero 
          featured={activeFeatured} 
          onMoreInfo={openFeaturedSlideshow} 
        />

        {/* Rows container pulled up slightly to sit below Hero buttons while floating on top of background */}
        <div className="relative -mt-12 md:-mt-24 pb-20 z-20 bg-transparent">
          {occasions.map((occ) => {
            // Slice items inside row to max 5 items (most shoots naturally have 1 to 3 anyway)
            const limitedItems = occ.images.slice(0, 5);
            return (
              <Row
                key={occ.id}
                title={occ.title}
                items={limitedItems}
                layout={occ.aspect === "landscape" ? "landscape" : "portrait"}
                onOpenCard={(idx) => openItem(occ, idx)}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </main>

      <Footer />

      <Slideshow
        item={openItemState}
        startIndex={slideshowStartIndex}
        onClose={() => setOpenItemState(null)}
      />
    </div>
  );
}
