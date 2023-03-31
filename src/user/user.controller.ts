import { Controller,Post,Delete,Get,Put, Param,Body } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './interface/user.interface';
import { Observable, catchError, map, of } from 'rxjs';


@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

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
