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

const typed = data as unknown as {
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

