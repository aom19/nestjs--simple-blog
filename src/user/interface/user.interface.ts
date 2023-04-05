import { UserRole } from './user.entity';
import { BlogEntryEntity } from 'src/blog/models/blog-entry.entity';

export interface User {
  id: number;
  name?: string;
  username: string;
  password?: string;
  email: string;
  role?: UserRole;
  profileImage?: string;
  blogEntries?: BlogEntryEntity[];
}
