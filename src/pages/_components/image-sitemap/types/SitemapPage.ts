import type {SitemapImage} from "@src/pages/_components/image-sitemap/types/SitemapImage";

export interface SitemapPage {
  pageUrl: string;
  images: SitemapImage[];
}
