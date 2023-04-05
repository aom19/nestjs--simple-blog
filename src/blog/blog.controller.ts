import { Body, Controller, Request, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Get, Post, Patch, Delete, Param } from '@nestjs/common';

import { BlogEntry } from './models/blog-entry.interface';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  getAllBlogs(): Observable<BlogEntry[]> {
    return this.blogService.getAllBlogs();
  }

  @Get(':id')
  getBlogById(@Param('id') id: number): Observable<BlogEntry> {
    return this.blogService.getBlogById(id);
  }

  @Get('author/:authorId')
  getBlogByAuthorId(
    @Param('authorId') authorId: number,
  ): Observable<BlogEntry[]> {
    return this.blogService.getBlogByAuthorId(authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createBlog(@Body() blog: BlogEntry, @Request() req): Observable<BlogEntry> {
    console.log(req.user);
    const { user } = req.user;

    return this.blogService.createBlog(blog, user);
  }

  @Patch(':id')
  updateBlog() {}

  @Delete(':id')
  deleteBlog() {}
}
