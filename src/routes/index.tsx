import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Row, useIsMobile } from "@/components/Row";
import { Slideshow } from "@/components/Slideshow";
import { Footer } from "@/components/Footer";
import { getAlbums, resolveUrl, type GalleryItem, type MediaItem } from "@/lib/gallery";

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

  const openItem = (rowTitle: string, rowItems: MediaItem[], startIndex: number) => {
    setOpenItemState({
      id: rowTitle.toLowerCase().replace(/ /g, "_"),
      title: rowTitle,
      description: `Showcase of ${rowTitle}.`,
      date: "2025",
      aspect: "portrait",
      image: rowItems[startIndex].url,
      images: rowItems,
      album: rowTitle
    });
    setSlideshowStartIndex(startIndex);
  };

  const openFeaturedSlideshow = () => {
    // Find the media item in the database matching the activeFeatured.image
    const allMediaItems = albums.flatMap(a => a.items.flatMap(occ => occ.images));
    const filename = activeFeatured.image.split("/").pop();
    const matchIndex = allMediaItems.findIndex(img => img.url.endsWith(filename || ""));

    if (matchIndex !== -1) {
      openItem("Featured Showcase", allMediaItems, matchIndex);
    } else {
      const first = albums[0]?.items[0]?.images;
      if (first) {
        openItem("Showcase", first, 0);
      }
    }
  };

  // Construct 4 rich, long Netflix-like rows by flattening occasions inside category albums
  const categoryRows = albums
    .filter((a) => a.slug !== "recent")
    .map((album) => {
      const mediaItems = album.items.flatMap((occ) => occ.images);
      return {
        slug: album.slug,
        title: album.title,
        layout: album.layout,
        items: mediaItems
      };
    });

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Nav />

      <main>
        <Hero 
          featured={activeFeatured} 
          onMoreInfo={openFeaturedSlideshow} 
          onVideoEnded={nextFeatured} 
        />

        {/* Rows container pulled up to overlay transparently on top of full-screen background media */}
        <div className="relative -mt-36 md:-mt-64 pb-20 z-20">
          {categoryRows.map((row) => (
            <Row
              key={row.slug}
              title={row.title}
              items={row.items}
              layout={row.layout}
              onOpenCard={(idx) => openItem(row.title, row.items, idx)}
              isMobile={isMobile}
            />
          ))}
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
