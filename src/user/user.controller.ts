import { Controller,Post,Delete,Get,Put, Param,Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './interface/user.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';


@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }
    
    @hasRoles('Admin')
    @UseGuards(RolesGuard,JwtAuthGuard)
    @Get()
    findAll() {
        return this.userService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

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
