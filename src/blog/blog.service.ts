import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from './models/blog-entry.entity';
import { Observable, map, from, of, switchMap } from 'rxjs';
import { BlogEntry } from './models/blog-entry.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/interface/user.interface';
import slugify from 'slugify';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private readonly blogRepository: Repository<BlogEntryEntity>,
    private readonly userService: UserService,
  ) {}

  getAllBlogs(): Observable<BlogEntryEntity[]> {
    return from(this.blogRepository.find());
  }

  getBlogById(id: number): Observable<BlogEntryEntity> {
    return from(this.blogRepository.findOne({ where: { id } }));
  }

  getBlogByAuthorId(authorId: number): Observable<BlogEntryEntity[]> {
    return from(this.blogRepository.find());
  }

  createBlog(blogEntry: BlogEntry, user: User): Observable<BlogEntry> {
    blogEntry.author = user;
    return this.generateSlug(blogEntry.title).pipe(
      switchMap((slug: string) => {
        blogEntry.slug = slug;
        return from(this.blogRepository.save(blogEntry));
      }),
    );
  }

  updateBlog(id: number, blogEntry: BlogEntryEntity): Observable<any> {
    return from(this.blogRepository.update(id, blogEntry));
  }

  deleteBlog(id: number): Observable<any> {
    return from(this.blogRepository.delete(id));
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title, { lower: true }));
  }
}
