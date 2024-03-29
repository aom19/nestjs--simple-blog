import {
  Controller,
  Post,
  Delete,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './interface/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { join } from 'path';
import { UserIsUser } from 'src/auth/guards/UserIsUser';

const path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/profile_images',
    filename: (req, file, cb) => {
      const filename = path.parse(file.originalname).name.replace(/\s/g, '');
      const extension = path.parse(file.originalname).ext;
      cb(null, `${filename}-${Date.now()}${extension}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(PermissionGuard('user'))
  // @UseGuards(JwtAuthGuard)

  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/users',
        },
        {
          username,
          id: 0,
          email: '',
        },
      );
    }
  }

  // @hasRoles('Admin')
  @UseGuards(PermissionGuard('admin'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @hasRoles('Admin')
  @Post()
  create(@Body() user: User) {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard, UserIsUser)
  @Put(':id')
  update(@Param('id') id: number, @Body() user: User) {
    return this.userService.update(id, user);
  }

  @Post('login')
  login(@Body() user: User): Observable<any> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return {
          access_token: jwt,
        };
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<object> {
    const user: User = req.user.user;
    return this.userService
      .update(user.id, {
        profileImage: file.filename,
        id: user.id,
        username: user.username,
        email: user.email,
      })
      .pipe(
        tap((user: User) => console.log(user)),
        map((user: User) => ({ profileImage: user.profileImage })),
        catchError((err) => of({ error: err.message })),
      );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile-image/:imageName')
  findProfileImage(
    @Param('imageName') imageName,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profile_images/' + imageName)),
    );
  }
}
