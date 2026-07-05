import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { PublicRoute } from '../auth/public-decorator.js';

@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService){}

    @Get('listAll')
    listAllUsers() : Promise<any>{
        return this.userService.listAllUsers();
    }

    @PublicRoute()
    @Post('register')
    newUser(@Body() userData:any) : Promise<any> {
        return this.userService.newUser(userData);
    }
}