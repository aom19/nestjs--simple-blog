import { Controller,Post,Delete,Get,Put, Param,Body, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './interface/user.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Pagination } from 'nestjs-typeorm-paginate';


@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }
    
    @UseGuards(PermissionGuard('user'))
    @UseGuards(JwtAuthGuard)
    @Get()
    index(@Query('page') page:number =1 , @Query('limit') limit:number = 10   ): Observable<Pagination<User>> {
        return this.userService.paginate({
            page,
            limit,
            route: 'http://localhost:5000/user'


        })
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

}
