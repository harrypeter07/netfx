import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Row, useIsMobile } from "@/components/Row";
import { Slideshow } from "@/components/Slideshow";
import { Footer } from "@/components/Footer";
import { getAlbums, resolveUrl, type Album, type GalleryItem } from "@/lib/gallery";

export const Route = createFileRoute("/")({
  component: Index,
});

const AUTO_SCROLL_ALBUMS = new Set(["portraits", "candid", "travel"]);

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
  
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const rawFeatured = FEATURED_POOL[currentFeaturedIndex];

  // Resolve ImageKit URLs dynamically
  const featured = {
    ...rawFeatured,
    image: resolveUrl(rawFeatured.image)
  };

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % FEATURED_POOL.length);
  };

  // Rotates images after 2 seconds (2000ms), wait for video ended for clips
  useEffect(() => {
    if (featured.image.endsWith(".mp4")) {
      return;
    }
    const timer = setTimeout(() => {
      nextFeatured();
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentFeaturedIndex, featured.image]);

  const [openItemState, setOpenItemState] = useState<GalleryItem | null>(null);

  const openItem = (item: GalleryItem) => {
    setOpenItemState(item);
  };

  const openFeaturedSlideshow = () => {
    // If the active featured item is a video, open the video_clips slideshow
    if (featured.image.endsWith(".mp4")) {
      const videoItem = albums
        .find(a => a.slug === "videos")
        ?.items.find(item => item.id === "video_clips");
      if (videoItem) {
        setOpenItemState(videoItem);
        return;
      }
    }

    // Otherwise, open the matching occasion card
    const matchingItem = albums
      .flatMap(a => a.items)
      .find(item => item.id === featured.id);
    
    if (matchingItem) {
      setOpenItemState(matchingItem);
    } else {
      const first = albums[0]?.items[0];
      if (first) setOpenItemState(first);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Nav />

      <main>
        <Hero 
          featured={featured} 
          onMoreInfo={openFeaturedSlideshow} 
          onVideoEnded={nextFeatured} 
        />

        <div className="relative -mt-16 md:-mt-24 z-10">
          {albums.map((a) => (
            <Row
              key={a.slug}
              album={a}
              onOpen={openItem}
              isMobile={isMobile}
              autoScroll={AUTO_SCROLL_ALBUMS.has(a.slug)}
            />
          ))}
        </div>
      </main>

      <Footer />

      <Slideshow
        item={openItemState}
        onClose={() => setOpenItemState(null)}
      />
    </div>
  );
}
