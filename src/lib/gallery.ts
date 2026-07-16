import data from "@/data/gallery.json";

export type Aspect = "portrait" | "landscape";
export type Layout = "portrait" | "landscape";

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  caption: string;
  outfit?: string;
  type: "image" | "video";
  aspect: Aspect;
}

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  album: string;
  image: string;
  aspect: Aspect;
  description: string;
  images: MediaItem[];
}

export interface Album {
  slug: string;
  title: string;
  layout: Layout;
  items: GalleryItem[];
}

export interface Featured {
  id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  tag: string;
  images?: MediaItem[]; // Optional: can also play featured slideshow
}

export interface Person {
  name: string;
  initial: string;
  tagline: string;
}

// Configure your ImageKit URL endpoint here or in your .env file as VITE_IMAGEKIT_ENDPOINT
// Example: "https://ik.imagekit.io/your_imagekit_id"
const IMAGEKIT_ENDPOINT = (import.meta.env.VITE_IMAGEKIT_ENDPOINT as string) || "";

export const resolveUrl = (url: string): string => {
  if (IMAGEKIT_ENDPOINT && url && url.startsWith("/gallery/")) {
    return `${IMAGEKIT_ENDPOINT}${url}`;
  }
  return url;
};

const transformData = (raw: typeof data) => {
  const cloned = JSON.parse(JSON.stringify(raw));

  if (cloned.featured) {
    cloned.featured.image = resolveUrl(cloned.featured.image);
    if (cloned.featured.images) {
      cloned.featured.images.forEach((img: any) => {
        img.url = resolveUrl(img.url);
      });
    }
  }

  if (cloned.albums) {
    cloned.albums.forEach((album: any) => {
      if (album.items) {
        album.items.forEach((item: any) => {
          item.image = resolveUrl(item.image);
          if (item.images) {
            item.images.forEach((img: any) => {
              img.url = resolveUrl(img.url);
            });
          }
        });
      }
    });
  }
  return cloned;
};

const typed = transformData(data) as unknown as {
  person: Person;
  featured: Featured;
  albums: Album[];
};

export const getPerson = (): Person => typed.person;
export const getFeatured = (): Featured => typed.featured;
export const getAlbums = (): Album[] => typed.albums;
export const getAlbum = (slug: string): Album | undefined =>
  typed.albums.find((a) => a.slug === slug);
export const getItemById = (id: string): GalleryItem | undefined => {
  for (const a of typed.albums) {
    const found = a.items.find((i) => i.id === id);
    if (found) return found;
  }
  return undefined;
};

