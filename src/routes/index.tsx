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

// Hero slideshow pool — the 5 images + 2 videos the user explicitly selected
const FEATURED_POOL = [
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
    description: "Stepping out to enjoy the daylight in a vibrant printed kurti.",
    image: "/gallery/casual_outdoor_blue_kurti_2.jpeg",
    year: "2025",
    tag: "Featured Showcase"
  },
  {
    id: "festival_celebration_pink_saree",
    title: "Festival Celebration",
    description: "Draped in an exquisite pink saree, celebrating every festive moment.",
    image: "/gallery/festival_celebration_pink_saree_1.jpeg",
    year: "2025",
    tag: "Featured Showcase"
  },
  {
    id: "garden_photoshoot_pink_saree",
    title: "Garden Photoshoot",
    description: "A beautiful afternoon among blooming flowers in a gorgeous pink saree.",
    image: "/gallery/garden_photoshoot_pink_saree_1.jpeg",
    year: "2025",
    tag: "Featured Showcase"
  },
  {
    id: "casual_outdoor_red_kurta",
    title: "Casual Outdoor",
    description: "Effortlessly stylish in a bold red kurta against the open sky.",
    image: "/gallery/casual_outdoor_red_kurta_1.jpeg",
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

// Interleave videos into an image list at every 2nd position
function interleaveVideos(imageItems: MediaItem[], videoItems: MediaItem[]): MediaItem[] {
  const result: MediaItem[] = [];
  let videoIdx = 0;
  for (let i = 0; i < imageItems.length; i++) {
    result.push(imageItems[i]);
    if ((i + 1) % 2 === 0 && videoIdx < videoItems.length) {
      result.push(videoItems[videoIdx]);
      videoIdx++;
    }
  }
  return result;
}

function Index() {
  const albums = getAlbums();
  const isMobile = useIsMobile();

  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % FEATURED_POOL.length);
  };

  const rawFeatured = FEATURED_POOL[currentFeaturedIndex];
  const activeFeatured = {
    ...rawFeatured,
    image: resolveUrl(rawFeatured.image)
  };

  // Rotate images every 3 seconds; videos advance on video end
  useEffect(() => {
    if (activeFeatured.image.endsWith(".mp4")) return;
    const timer = setTimeout(nextFeatured, 3000);
    return () => clearTimeout(timer);
  }, [currentFeaturedIndex]);

  const [openItemState, setOpenItemState] = useState<GalleryItem | null>(null);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);

  const openItem = (rowTitle: string, rowItems: MediaItem[], startIndex: number) => {
    setOpenItemState({
      id: rowTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      title: rowTitle,
      description: `${rowTitle} collection.`,
      date: "2025",
      aspect: "portrait",
      image: rowItems[startIndex]?.url ?? "",
      images: rowItems,
      album: rowTitle
    });
    setSlideshowStartIndex(startIndex);
  };

  const openFeaturedSlideshow = () => {
    const allItems = albums.flatMap(a => a.items.flatMap(occ => occ.images));
    const filename = activeFeatured.image.split("/").pop() ?? "";
    const matchIdx = allItems.findIndex(img => img.url.split("/").pop() === filename);
    openItem("Featured Showcase", allItems, matchIdx >= 0 ? matchIdx : 0);
  };

  // Build rows: gather all images and all videos from the database
  const allImages: MediaItem[] = albums
    .filter(a => a.slug !== "recent" && a.slug !== "videos")
    .flatMap(a => a.items.flatMap(occ => occ.images));

  const allVideos: MediaItem[] = (albums.find(a => a.slug === "videos")?.items ?? [])
    .flatMap(occ => occ.images);

  // Interleave: insert one video after every 2 images
  const interleavedMedia = interleaveVideos(allImages, allVideos);

  // Chunk into rows of 5
  const rows: { title: string; items: MediaItem[]; offset: number }[] = [];
  for (let i = 0; i < interleavedMedia.length; i += 5) {
    const chunk = interleavedMedia.slice(i, i + 5);
    rows.push({ title: `Gallery · Row ${rows.length + 1}`, items: chunk, offset: i });
  }

  return (
    <div className="min-h-screen bg-[#141414] text-foreground">
      <Nav />

      <main>
        <Hero
          featured={activeFeatured}
          onMoreInfo={openFeaturedSlideshow}
          onVideoEnded={nextFeatured}
        />

        {/* Card rows sit directly below the hero */}
        <div className="relative z-20 bg-[#141414] pb-20">
          {rows.map((row) => (
            <Row
              key={row.offset}
              title={row.title}
              items={row.items}
              layout="portrait"
              onOpenCard={(cardIdx) => openItem(row.title, interleavedMedia, row.offset + cardIdx)}
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
