import { UserEntity } from 'src/user/interface/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';

@Entity('blog_entry')
export class BlogEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  views: number;

  @Column()
  headerImage: string;

  @Column()
  publishedDate: Date;

  @Column()
  isPublished: boolean;

  @ManyToOne((type) => UserEntity, (user) => user.blogEntries)
  author: UserEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
