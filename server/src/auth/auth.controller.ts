import { Controller, Post, Get, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { PublicRoute } from "../_nestjs_decorators/public.decorator.js";
import { LocalAuthGuard } from "./local-auth.guard.js";
import { Authorized_Roles } from "../_nestjs_decorators/roles.decorator.js";

@Authorized_Roles(['ADMIN'])
@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @PublicRoute()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({passthrough: true}) res) {
        if(req.user != 0) {
            const isUserActive = await this.authService.isUserActive(Number(req.user.user_id));
            if(isUserActive == 1){
                const token = await this.authService.generateToken(req.user);
                res.cookie('access-token', token, {
                    httpOnly: true,
                    secure: false
                });
                return { message: "OK" };
            } 
            else 
                return "INACTIVE";
        } 
        else if (req.user == 0) 
            return "INV_CRED";
    }

    @Authorized_Roles(['USER'])
    @Get('me')
    getCurrentUser(@Request() req) {
        return req.user;
    }

    @Authorized_Roles(['USER'])
    @Get('type')
    getAdminCheck(@Request() req){
        return this.authService.getAdminCheck(req.user)
    }

    @Authorized_Roles(['USER'])
    @Get('session') 
    getSession( @Request() req )
    { return req.cookies['access-token'] != undefined ? true : false }

    @Authorized_Roles(['USER'])
    @Post('logout')
    logout(@Res({ passthrough: true }) res){
        res.clearCookie('access-token', {
            httpOnly: true,
            secure: false
        });
        return { message: "OK" };
    }
}