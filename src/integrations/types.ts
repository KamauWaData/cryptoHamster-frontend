export interface Article {
  id: number; // Django uses numeric IDs by default
  title: string;
  excerpt: string;
  category: string;
  image_url: string; // Match Django's field names
  author_name: string;
  author?: {name: string; image_url: string; bio: string}; // Assuming author is an object with these properties
  author_id: number; // Assuming author is a foreign key to a User model
  published_date: string; // ISO date string
  content: string;
  status: 'published' | 'draft';
  created_at?: string; // Optional, if your Django model includes it
  last_updated?: string; // Optional, if your Django model includes it
  is_auto_update?: boolean;
  is_editors_pick: boolean;
  is_featured: boolean; 
  author_image_url?: string; // Optional, if your Django model includes it
  author_bio?: string; // Optional, if your Django model includes it
  tags?: string | string[]; // Optional, if your Django model includes it
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  created_at?: string;
}

export interface Ad {
  id: string;
  name: string;
  type: 'leaderboard' | 'rectangle' | 'sidebar';
  active: boolean;
  location: string;
  created_at?: string;
}

export const Constants = {
  public: {
    Enums: {
      ArticleStatus: ['draft', 'published'] as const,
    },
  },
} as const;