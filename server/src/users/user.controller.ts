import { Body, Controller, Delete, Get, Post, Query, Req, Request } from '@nestjs/common';
import { UserService } from './user.service.js';
import { PublicRoute } from '../_nestjs_decorators/public.decorator.js';
import { Authorized_Roles } from '../_nestjs_decorators/roles.decorator.js';

@Controller('users')
@Authorized_Roles(['ADMIN'])
export class UserController {
    constructor(private readonly userService : UserService){}

    @PublicRoute()
    @Post('signup')
    newUser(@Body() userData:any) : Promise<any> {
        return this.userService.newUser(userData);
    }

    @PublicRoute()
    @Get('check')
    userExists(@Query('username') username: string) {
        console.log(username)
        return this.userService.userExists(username)
    }

    @Get('all')
    listAllUsers() : Promise<any>{
        return this.userService.listAllUsers();
    }

    @Get('find')
    findOne(
        @Query('spec') spec,
        @Request() req ,
        @Body() body: { username: string }) : Promise<any> 
    {
        return this.userService.findUser(spec == "current" ? req.user.username : body.username);
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

    @Post('user/credentials')
    editUserCredentials(
        @Query('type') type: string,
        @Request() req,
        @Body() body: { new_username: string } | { new_password: string }
    ) {
        if(type == "pwd")
        {   
            const { new_password } = body as { new_password: string };
            return this.userService.updatePassword(req.user.username, new_password)
        }

        if(type == "usn"){
            const { new_username } = body as { new_username: string };
            return this.userService.updateUsername(req.user.username, new_username)
        }
    }

}