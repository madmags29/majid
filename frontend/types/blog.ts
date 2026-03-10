export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  heroImage: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  keyword: string;
  author: string;
  publishedDate: string;
  updatedAt?: string;
}

export interface BlogKeyword {
  _id: string;
  keyword: string;
  used: boolean;
  createdAt: string;
  usedAt?: string;
}
