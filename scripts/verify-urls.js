import fs from "fs";
import path from "path";

const GALLERY_JSON_PATH = path.resolve("src/data/gallery.json");
const PUBLIC_DIR = path.resolve("public");

// Dynamic featured pool from index.tsx
const FEATURED_POOL = [
  { id: "evening_party_black_lehenga", image: "/gallery/evening_party_black_lehenga_1.jpeg" },
  { id: "candid_home_pink_top", image: "/gallery/candid_home_pink_top_1.jpeg" },
  { id: "casual_outdoor_blue_kurti", image: "/gallery/casual_outdoor_blue_kurti_2.jpeg" },
  { id: "video_clips_video", image: "/gallery/video_clips_video_2.mp4" },
  { id: "video_clips_video", image: "/gallery/video_clips_video_7.mp4" }
];

function verify() {
  console.log("Starting Gallery media verifier...");

  if (!fs.existsSync(GALLERY_JSON_PATH)) {
    console.error("gallery.json not found!");
    return;
  }

  const data = JSON.parse(fs.readFileSync(GALLERY_JSON_PATH, "utf8"));
  const missingFiles = [];

  const checkFile = (url) => {
    if (!url) return;
    const localPath = path.join(PUBLIC_DIR, url);
    if (!fs.existsSync(localPath)) {
      missingFiles.push(url);
    }
  };

  // Check featured
  if (data.featured) {
    checkFile(data.featured.image);
    if (data.featured.images) {
      data.featured.images.forEach(img => checkFile(img.url));
    }
  }

  // Check albums
  if (data.albums) {
    data.albums.forEach(album => {
      if (album.items) {
        album.items.forEach(item => {
          checkFile(item.image);
          if (item.images) {
            item.images.forEach(img => checkFile(img.url));
          }
        });
      }
    });
  }

  // Check featured pool
  FEATURED_POOL.forEach(item => {
    checkFile(item.image);
  });

  const uniqueMissing = [...new Set(missingFiles)];

  if (uniqueMissing.length > 0) {
    console.log(`\nFound ${uniqueMissing.length} missing files in public/gallery/:\n`);
    uniqueMissing.forEach(file => {
      console.log(` - ${file}`);
    });
  } else {
    console.log("\nAll images and videos exist on disk! No missing files.");
  }
}

verify();
