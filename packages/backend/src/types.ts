/**
 * Market event interface
 */
export interface MarketEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
}

/**
 * Gallery image interface
 */
export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  order?: number;
}
