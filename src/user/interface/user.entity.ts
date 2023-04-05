import { BlogEntryEntity } from 'src/blog/models/blog-entry.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  User = 'user',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @OneToMany(() => BlogEntryEntity, (blogEntry) => blogEntry.author)
  blogEntries: BlogEntryEntity[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
