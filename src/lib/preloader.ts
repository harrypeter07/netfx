import galleryData from "../data/gallery.json";

/**
 * Collects every media URL from gallery.json.
 * Images: preloaded via new Image() — gets browser-cached immediately.
 * Videos: preloaded via <link rel=preload> or fetch for metadata only.
 */
function collectUrls() {
  const images = new Set<string>();
  const videos = new Set<string>();

  const add = (url: string) => {
    if (!url) return;
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")) {
      videos.add(url);
    } else {
      images.add(url);
    }
  };

  // Featured
  if (galleryData.featured?.image) add(galleryData.featured.image);
  galleryData.featured?.images?.forEach((img: any) => add(img.url));

  // Albums
  galleryData.albums?.forEach((album: any) => {
    album.items?.forEach((item: any) => {
      if (item.image) add(item.image);
      item.images?.forEach((img: any) => add(img.url));
    });
  });

  return { images: Array.from(images), videos: Array.from(videos) };
}

const { images: ALL_IMAGES, videos: ALL_VIDEOS } = collectUrls();

/** 
 * Starts background preloading of ALL gallery assets.
 * Safe to call multiple times — uses a module-level flag.
 * Returns a function that reports current progress (0–100).
 */
let _started = false;
let _loadedCount = 0;
let _totalCount = 0;
let _listeners: Array<(pct: number) => void> = [];

function notifyListeners() {
  const pct = _totalCount > 0 ? Math.round((_loadedCount / _totalCount) * 100) : 0;
  _listeners.forEach((fn) => fn(pct));
}

export function startBackgroundPreload() {
  if (_started) return;
  _started = true;

  _totalCount = ALL_IMAGES.length + ALL_VIDEOS.length;
  if (_totalCount === 0) return;

  const bump = () => { _loadedCount++; notifyListeners(); };

  // ── Images via new Image() — fully cached by browser ──
  ALL_IMAGES.forEach((src) => {
    const img = new window.Image();
    img.onload  = bump;
    img.onerror = bump;
    img.src = src;
  });

  // ── Videos: fetch first 1 byte range to prime the cache / trigger metadata ──
  // We don't download the whole video, just enough for the browser to know it exists
  ALL_VIDEOS.forEach((src) => {
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.muted   = true;
    vid.onloadedmetadata = bump;
    vid.onerror          = bump;
    vid.src = src;
    // Don't attach to DOM — just kick the browser to start buffering metadata
  });
}

/** Subscribe to progress updates (0–100). Returns unsubscribe fn. */
export function onPreloadProgress(fn: (pct: number) => void): () => void {
  _listeners.push(fn);
  // Fire immediately with current value
  fn(_totalCount > 0 ? Math.round((_loadedCount / _totalCount) * 100) : 0);
  return () => { _listeners = _listeners.filter((l) => l !== fn); };
}

export function getPreloadProgress(): number {
  return _totalCount > 0 ? Math.round((_loadedCount / _totalCount) * 100) : 0;
}

export const TOTAL_ASSETS = ALL_IMAGES.length + ALL_VIDEOS.length;
