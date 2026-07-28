import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service.js';
import { PublicRoute } from '../_nestjs_decorators/public.decorator.js';
import { Authorized_Roles } from '../_nestjs_decorators/roles.decorator.js';

@Controller('users')
@Authorized_Roles(['ADMIN'])
export class UserController {
    constructor(private readonly userService : UserService){}

    @PublicRoute()
    @Post('register')
    newUser(@Body() userData:any) : Promise<any> {
        return this.userService.newUser(userData);
    }

    @Get('all')
    listAllUsers() : Promise<any>{
        return this.userService.listAllUsers();
    }

    @Get('find')
    findOne(@Body() body: { username:string }) : Promise<any> {
        const { username } = body;
        return this.userService.findUser(username);
    }

    @Delete('terminate')
    @Authorized_Roles(['USER'])
    terminateUser(@Req() req, @Body() body:{username:string}) : Promise<any> {
        return this.userService.deleteUser(req.user, body);
    }

    @Post('edit')
    @Authorized_Roles(['USER'])
    editUser(@Req() req, @Body() body: { username: string, fields: object }) : Promise<any>{
        return this.userService.editUser(req.user, body);
    }
}