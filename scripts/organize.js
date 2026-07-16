import fs from "fs";
import path from "path";

const API_KEYS = process.env.GEMINI_API_KEYS
  ? process.env.GEMINI_API_KEYS.split(",").map(k => k.trim())
  : [];

if (API_KEYS.length === 0) {
  console.error("Error: GEMINI_API_KEYS environment variable is not defined or is empty.");
  console.error("Please set GEMINI_API_KEYS in your environment or in a .env file.");
  process.exit(1);
}

let keyIndex = 0;


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SOURCE_DIR = path.resolve("public/galleryy");
const DEST_DIR = path.resolve("public/gallery");
const BACKUP_DIR = path.resolve("public/gallery_old");
const GALLERY_JSON_PATH = path.resolve("src/data/gallery.json");

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".mp4":
      return "video/mp4";
    default:
      return null;
  }
}

// Low-level fetch wrapper with error status extraction
async function callGemini(endpoint, method, body, apiKey) {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${endpoint}${separator}key=${apiKey}`;

  const isGetOrDelete = method === "GET" || method === "DELETE";
  const res = await fetch(url, {
    method,
    headers: isGetOrDelete ? {} : { "Content-Type": "application/json" },
    body: isGetOrDelete ? undefined : JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw { status: res.status, message: text };
  }

  return await res.json();
}

// Upload file to Gemini File API (requires same API key as analysis)
async function uploadToGeminiFileApi(filePath, mimeType, apiKey) {
  const fileStats = fs.statSync(filePath);
  const fileBytes = fs.readFileSync(filePath);
  const filename = path.basename(filePath);

  console.log(`[Upload] Starting upload for video ${filename} (${(fileStats.size / 1024 / 1024).toFixed(2)} MB)...`);

  // Step 1: Start resumable session
  const startUrl = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`;
  const startRes = await fetch(startUrl, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": fileStats.size.toString(),
      "X-Goog-Upload-Header-Content-Type": mimeType,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file: { displayName: filename }
    })
  });

  if (!startRes.ok) {
    const text = await startRes.text();
    throw { status: startRes.status, message: `Start upload failed: ${text}` };
  }

  const uploadUrl = startRes.headers.get("X-Goog-Upload-URL");

  // Step 2: Upload actual bytes using 'upload, finalize'
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize",
      "Content-Length": fileStats.size.toString()
    },
    body: fileBytes
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw { status: uploadRes.status, message: `Finalize upload failed: ${text}` };
  }

  const metadata = await uploadRes.json();
  console.log(`[Upload] Successfully uploaded video ${filename} to File API.`);
  return metadata.file;
}

// Delete file from Gemini File API (must use same API key as upload)
async function deleteGeminiFile(fileName, apiKey) {
  const fileId = fileName.replace("files/", "");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/files/${fileId}`;
  try {
    await callGemini(endpoint, "DELETE", {}, apiKey);
    console.log(`[Clean] Deleted remote file ${fileName} from File API.`);
  } catch (err) {
    console.warn(`[Clean Warning] Failed to delete ${fileName}:`, err.message || err);
  }
}

// Poll file state until ACTIVE (required for video files)
async function waitForFileActive(fileName, apiKey) {
  const fileId = fileName.replace("files/", "");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/files/${fileId}`;
  
  console.log(`[Poll] Waiting for video ${fileName} processing...`);
  
  let state = "PROCESSING";
  let count = 0;
  while (state === "PROCESSING") {
    await sleep(2500); // Poll every 2.5 seconds
    const data = await callGemini(endpoint, "GET", null, apiKey);
    state = data.state;
    count++;
    if (count > 25) {
      throw new Error("File processing timed out (exceeded 60s)");
    }
    if (state === "FAILED") {
      throw new Error("File processing failed on Gemini server");
    }
  }
  console.log(`[Poll] Video ${fileName} is ACTIVE.`);
}

// Analyze video using the uploaded File API URI
async function analyzeFileUri(fileUri, mimeType, filename, apiKey) {
  console.log(`[Analyze] Analyzing video ${filename} via File API...`);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent`;
  const body = {
    contents: [
      {
        parts: [
          {
            fileData: {
              fileUri: fileUri,
              mimeType: mimeType
            }
          },
          {
            text: getPrompt()
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const data = await callGemini(endpoint, "POST", body, apiKey);
  const jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(jsonStr.trim());
}

// Analyze image using base64 inlineData (bypasses File API entirely)
async function analyzeFileBase64(filePath, mimeType, filename, apiKey) {
  console.log(`[Analyze] Analyzing image ${filename} via inline base64...`);
  const fileBytes = fs.readFileSync(filePath);
  const base64Data = fileBytes.toString("base64");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent`;
  const body = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: getPrompt()
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const data = await callGemini(endpoint, "POST", body, apiKey);
  const jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(jsonStr.trim());
}

function getPrompt() {
  return `Analyze this media file and return a JSON object.
Analyze the occasion/location and the outfit of the main person.
Return a JSON object with:
{
  "occasion_guess": "A descriptive label of the event or location (e.g. 'candid_home', 'beach_trip', 'wedding_reception', 'restaurant') in lowercase with underscores",
  "outfit_guess": "A brief description of the main clothing outfit colors/style (e.g. 'blue_shirt_jeans', 'black_dress', 'white_tshirt', 'formal') in lowercase with underscores",
  "title": "A short, beautiful, poetic title for this specific frame/moment (e.g. 'Fireside Warmth', 'Ocean View')",
  "caption": "A beautiful, poetic, and engaging caption describing the visual scene and visual details/mood (1-2 sentences)",
  "date": "Estimated date/month if possible (e.g. 'Mar 2025' or 'Oct 2024'), or empty string if not visible",
  "aspect": "portrait" or "landscape" (guess based on dimensions/aspect ratio)
}
Return ONLY valid JSON. Do not include markdown codeblocks.`;
}

// Process a single file with key binding
async function processFile(filePath, apiKey) {
  const mimeType = getMimeType(filePath);
  const filename = path.basename(filePath);
  const isVideo = mimeType.startsWith("video/");

  if (isVideo) {
    console.log(`[Skip video] Placing video ${filename} directly into the Video Clips collection.`);
    return {
      originalName: filename,
      occasion_guess: "video_clips",
      outfit_guess: "video",
      title: "Memory in Motion",
      caption: "A beautiful memory captured in video.",
      date: "2025",
      aspect: "landscape",
      type: "video"
    };
  } else {
    // Inline base64 analysis
    const result = await analyzeFileBase64(filePath, mimeType, filename, apiKey);
    return {
      originalName: filename,
      ...result
    };
  }
}

// Process single file with global key rotation & retry
async function processFileWithRetry(filePath) {
  let attempt = 0;
  while (attempt < 5) {
    const key = API_KEYS[keyIndex];
    try {
      const res = await processFile(filePath, key);
      return res;
    } catch (err) {
      console.log(`[Retry Handler] File ${path.basename(filePath)} failed on attempt ${attempt + 1} using Key Index ${keyIndex}. Status: ${err.status || err.message}`);
      
      // Rotate key
      keyIndex = (keyIndex + 1) % API_KEYS.length;
      console.log(`Swapping to Key Index ${keyIndex}. Sleeping 8 seconds...`);
      await sleep(8000);
      attempt++;
    }
  }
  throw new Error(`Failed to process ${path.basename(filePath)} after 5 attempts.`);
}

// Unify occasion and outfit tags
async function consolidateMetadata(items) {
  console.log(`[Consolidate] Consolidating occasion and outfit names...`);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent`;
  
  const body = {
    contents: [
      {
        parts: [
          {
            text: `You are a professional photo grid manager. Below is a JSON list of photos/videos with temporary occasion guesses and outfit descriptions.
Group similar occasions together (e.g. 'seaside_outing' and 'beach_trip' should be unified into a single occasion slug 'beach_trip').
Similarly, group outfit descriptions for consistency.
Return a JSON array of the photos where the 'occasion' slug and 'outfit' slug are unified across similar items. Keep the 'title', 'caption', 'date', 'aspect' fields, but tweak them if necessary for consistency.

Input list:
${JSON.stringify(items, null, 2)}

Return a JSON array ONLY in this format:
[
  {
    "originalName": "filename.jpg",
    "occasion": "unified_occasion_slug",
    "outfit": "unified_outfit_slug",
    "title": "Consolidated Title",
    "caption": "Beautiful Caption",
    "date": "Month Year",
    "aspect": "portrait" or "landscape"
  }
]
Return ONLY valid JSON. Do not include markdown codeblocks.`
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  // Consolidate using active key index
  const key = API_KEYS[keyIndex];
  const data = await callGemini(endpoint, "POST", body, key);
  const jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(jsonStr.trim());
}

async function run() {
  console.log("Starting Netflix Showcase Organizer (Optimized Vision Flow)...");

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Error: Source directory ${SOURCE_DIR} does not exist.`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => getMimeType(f) !== null);
  console.log(`Found ${files.length} supported files in public/galleryy/`);

  // Load cache from disk to support resuming
  const CACHE_PATH = path.resolve("scripts/cache.json");
  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
      console.log(`Loaded ${Object.keys(cache).length} cached items from ${CACHE_PATH}`);
    } catch (e) {
      console.warn("Failed to parse cache, starting fresh.");
    }
  }

  const rawResults = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(SOURCE_DIR, file);
    console.log(`\n[Progress ${i + 1}/${files.length}]`);
    
    if (cache[file]) {
      console.log(`[Cache Hit] Using cached metadata for ${file}`);
      rawResults.push(cache[file]);
      continue;
    }

    try {
      const res = await processFileWithRetry(filePath);
      if (res) {
        rawResults.push(res);
        cache[file] = res;
        fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
        console.log(`[Success] Got metadata for ${file} and cached.`);
      }
    } catch (err) {
      console.error(`[Critical Failure] Skipping ${file} due to:`, err.message);
    }
    // Rate limit control spacing
    await sleep(2000);
  }

  if (rawResults.length === 0) {
    console.log("No files were successfully analyzed.");
    return;
  }

  console.log(`\nSuccessfully analyzed ${rawResults.length} files. Starting consolidation...`);

  let consolidated = [];
  try {
    consolidated = await consolidateMetadata(rawResults);
  } catch (err) {
    console.error("Failed consolidation step. Falling back to raw guesses:", err.message);
    consolidated = rawResults.map(r => ({
      ...r,
      occasion: r.occasion_guess || "candid",
      outfit: r.outfit_guess || "casual"
    }));
  }

  // Backup old public/gallery if it exists
  if (fs.existsSync(DEST_DIR)) {
    if (fs.existsSync(BACKUP_DIR)) {
      console.log(`[Backup] Removing old backup at ${BACKUP_DIR}`);
      fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
    }
    console.log(`[Backup] Backing up current gallery to ${BACKUP_DIR}`);
    fs.renameSync(DEST_DIR, BACKUP_DIR);
  }

  // Create clean destination directory
  fs.mkdirSync(DEST_DIR, { recursive: true });

  console.log("\nCopying and renaming files to public/gallery/...");

  const renameGroups = {};
  const galleryItemsMap = {}; 

  for (const item of consolidated) {
    const ext = path.extname(item.originalName);
    const mimeType = getMimeType(item.originalName);
    const isVideo = mimeType.startsWith("video/");
    const groupKey = `${item.occasion}_${item.outfit}`;

    if (!renameGroups[groupKey]) {
      renameGroups[groupKey] = 0;
    }
    renameGroups[groupKey]++;

    const indexInGroup = renameGroups[groupKey];
    const newFileName = `${groupKey}_${indexInGroup}${ext}`;
    
    const srcPath = path.join(SOURCE_DIR, item.originalName);
    const destPath = path.join(DEST_DIR, newFileName);
    fs.copyFileSync(srcPath, destPath);

    const mediaItem = {
      id: `${item.occasion}_img_${indexInGroup}_${Date.now().toString().slice(-4)}`,
      url: `/gallery/${newFileName}`,
      title: item.title || "Moment",
      caption: item.caption || "",
      outfit: item.outfit,
      type: isVideo ? "video" : "image",
      aspect: item.aspect || "portrait"
    };

    if (!galleryItemsMap[item.occasion]) {
      galleryItemsMap[item.occasion] = {
        id: item.occasion,
        title: item.occasion.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        date: item.date || "2025",
        description: `A collection from ${item.occasion.replace(/_/g, " ")}.`,
        aspect: item.aspect || "portrait",
        images: []
      };
    }
    galleryItemsMap[item.occasion].images.push(mediaItem);
  }

  console.log("\nStructuring gallery JSON...");

  const albums = [
    {
      slug: "recent",
      title: "Recently Added",
      layout: "landscape",
      items: []
    },
    {
      slug: "videos",
      title: "Videos & Clips",
      layout: "landscape",
      items: []
    },
    {
      slug: "travel",
      title: "Travel & Trips",
      layout: "portrait",
      items: []
    },
    {
      slug: "portraits",
      title: "Outfits & Portraits",
      layout: "portrait",
      items: []
    },
    {
      slug: "candid",
      title: "Candid Moments",
      layout: "landscape",
      items: []
    }
  ];

  const occasions = Object.values(galleryItemsMap);
  for (const occ of occasions) {
    occ.image = occ.images[0].url;
    occ.aspect = occ.images[0].aspect;

    const slug = occ.id.toLowerCase();
    if (slug.includes("video")) {
      occ.album = "Videos & Clips";
      albums[1].items.push(occ);
    } else if (slug.includes("trip") || slug.includes("travel") || slug.includes("visit") || slug.includes("park") || slug.includes("beach") || slug.includes("lake") || slug.includes("mountain") || slug.includes("hike")) {
      occ.album = "Travel & Trips";
      albums[2].items.push(occ);
    } else if (slug.includes("portrait") || slug.includes("shoot") || slug.includes("outfit") || slug.includes("model")) {
      occ.album = "Outfits & Portraits";
      albums[3].items.push(occ);
    } else {
      occ.album = "Candid Moments";
      albums[4].items.push(occ);
    }

    const recentOcc = JSON.parse(JSON.stringify(occ));
    recentOcc.album = "Recently Added";
    recentOcc.aspect = "landscape";
    albums[0].items.push(recentOcc);
  }

  albums[0].items = albums[0].items.slice(0, 5);
  const activeAlbums = albums.filter(a => a.items.length > 0);

  const featuredItem = occasions[0] || {
    id: "featured-hero",
    title: "Memories in Motion",
    description: "A showcase of captured moments, events, and outfits from recent journeys.",
    image: "/gallery/hero-maya.jpg",
    date: "2025"
  };

  const finalGalleryJson = {
    person: {
      name: "Gallery Showcase",
      initial: "G",
      tagline: "Life in frames — outfits, occasions, and quiet moments."
    },
    featured: {
      id: featuredItem.id,
      title: featuredItem.title,
      description: featuredItem.description,
      image: featuredItem.image,
      year: featuredItem.date,
      tag: "Featured Showcase",
      images: featuredItem.images || []
    },
    albums: activeAlbums
  };

  fs.writeFileSync(GALLERY_JSON_PATH, JSON.stringify(finalGalleryJson, null, 2), "utf8");
  console.log(`\nSuccessfully updated ${GALLERY_JSON_PATH}`);

  console.log("\nImage organization completed successfully!");
}

run().catch(console.error);
