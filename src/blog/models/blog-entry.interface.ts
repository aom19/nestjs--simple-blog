import { User } from 'src/user/interface/user.interface';

export interface BlogEntry {
  id: number;
  title: string;
  slug: string;
  description: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  likes: number;
  views: number;
  headerImage: string;
  publishedDate: Date;
  isPublished: boolean;
  author?: User;
}
