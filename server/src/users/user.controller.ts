import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { PublicRoute } from '../_nestjs_decorators/public.decorator.js';
import { Authorized_Roles } from '../_nestjs_decorators/roles.decorator.js';

@Controller('users')
@Authorized_Roles(['ADMIN'])
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