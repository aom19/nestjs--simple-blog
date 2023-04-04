import { Controller,Post,Delete,Get,Put, Param,Body, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './interface/user.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }
    
    // @UseGuards(PermissionGuard('user'))
    // @UseGuards(JwtAuthGuard)
    
    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

        if (username === null || username === undefined) {
            return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' });
        } else {
            return this.userService.paginateFilterByUsername(
                { page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' },
                {
                    username,
                    id: 0,
                    email: ''
                }
            )
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
            map((user: User) => user ),
            catchError(err => of({ error: err.message }))
        );
        

    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() user: User) {
        return this.userService.update(id, user);
    }




    @Post('login')
    login(@Body() user: User): Observable<any> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {
                    access_token: jwt
                };
            }
            )
        );

    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './uploads/profile_images',
            filename: (req, file, cb) => {
                const filename: string= path.parse(file.originalname).name.replace(/\s/g, '');
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}-${Date.now()}${extension}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            const filetypes: RegExp = /jpeg|jpg|png|gif/;
            const mimetype: boolean = filetypes.test(file.mimetype);
            const extname: boolean = filetypes.test(path.extname(file.originalname).toLowerCase());
            if (mimetype && extname) {
                return cb(null, true);
            }
            
        },
        limits: {
            fileSize: 1024 * 1024 * 5
        }
    }))
    uploadFile(@Body() file: any):Observable<object> {
        return of({message: 'File uploaded successfully'});

        
    }


}


