import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Row, useIsMobile } from "@/components/Row";
import { Slideshow } from "@/components/Slideshow";
import { Footer } from "@/components/Footer";
import { getAlbums, getFeatured, type Album, type GalleryItem } from "@/lib/gallery";

export const Route = createFileRoute("/")({
  component: Index,
});

const AUTO_SCROLL_ALBUMS = new Set(["portraits", "candid", "travel"]);

function Index() {
  const featured = getFeatured();
  const albums = getAlbums();
  const isMobile = useIsMobile();
  const [openItemState, setOpenItemState] = useState<GalleryItem | null>(null);

  const openItem = (item: GalleryItem) => {
    setOpenItemState(item);
  };

  const openFeaturedSlideshow = () => {
    // Find if featured has images, or find the first album item
    if (featured.images && featured.images.length > 0) {
      setOpenItemState({
        id: featured.id,
        title: featured.title,
        description: featured.description,
        date: featured.year,
        album: featured.tag,
        image: featured.image,
        aspect: "landscape",
        images: featured.images
      });
    } else {
      const first = albums[0]?.items[0];
      if (first) setOpenItemState(first);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Nav />

      <main>
        <Hero featured={featured} onMoreInfo={openFeaturedSlideshow} />

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
