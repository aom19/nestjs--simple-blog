import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntryEntity } from './models/blog-entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntryEntity]),
    AuthModule,
    UserModule,
  ],
  controllers: [BlogController],
})
export class BlogModule {}
