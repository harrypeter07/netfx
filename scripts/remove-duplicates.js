import fs from "fs";
import path from "path";

const GALLERY_JSON_PATH = path.resolve("src/data/gallery.json");
const GALLERY_DIR = path.resolve("public/gallery");

const DUPLICATE_FILES = [
  "candid_home_white_tshirt_1.jpeg",
  "casual_outdoor_blue_kurti_3.jpeg",
  "evening_party_green_lehenga_3.jpeg",
  "evening_party_green_lehenga_4.jpeg",
  "festival_celebration_pink_saree_2.jpeg",
  "video_clips_video_5.mp4"
];

function removeDuplicates() {
  console.log("Starting Duplicate Media Remover...");

  // 1. Delete duplicate files from disk
  DUPLICATE_FILES.forEach(file => {
    const filePath = path.join(GALLERY_DIR, file);
    if (fs.existsSync(filePath)) {
      console.log(`[Delete] Deleting duplicate file from disk: ${file}`);
      fs.unlinkSync(filePath);
    }
  });

  // 2. Update gallery.json
  if (!fs.existsSync(GALLERY_JSON_PATH)) {
    console.error("gallery.json not found!");
    return;
  }

  const data = JSON.parse(fs.readFileSync(GALLERY_JSON_PATH, "utf8"));

  const isDuplicate = (url) => {
    if (!url) return false;
    const filename = url.split("/").pop();
    return DUPLICATE_FILES.includes(filename);
  };

  // Filter featured images
  if (data.featured && data.featured.images) {
    data.featured.images = data.featured.images.filter(img => !isDuplicate(img.url));
  }

  // Filter albums and their internal items
  if (data.albums) {
    data.albums.forEach(album => {
      if (album.items) {
        album.items.forEach(item => {
          if (item.images) {
            item.images = item.images.filter(img => !isDuplicate(img.url));
          }
        });
        // Remove items with 0 images left
        album.items = album.items.filter(item => item.images && item.images.length > 0);
      }
    });
  }

  fs.writeFileSync(GALLERY_JSON_PATH, JSON.stringify(data, null, 2), "utf8");
  console.log("Successfully updated gallery.json (duplicates removed).");
}

removeDuplicates();
