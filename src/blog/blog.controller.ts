import { Controller } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Get, Post, Patch, Delete } from '@nestjs/common';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  getAllBlogs() {}

  @Get(':id')
  getBlogById() {}

  @Get('author/:id')
  getBlogByAuthorId() {}

  @Post()
  createBlog() {}

  @Patch(':id')
  updateBlog() {}

  @Delete(':id')
  deleteBlog() {}
}
