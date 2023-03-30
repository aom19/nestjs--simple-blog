import { Controller,Post,Delete,Get,Put, Param,Body } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './interface/user.interface';


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
        return this.userService.create(user);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() user: User) {
        return this.userService.update(id, user);
    }



}
