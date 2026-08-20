import { Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { PublicRoute } from "../_nestjs_decorators/public.decorator.js";
import { LocalAuthGuard } from "./local-auth.guard.js";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @PublicRoute()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({passthrough: true}) res){
        console.log(req)
        if(req.user != 0) {
            const isUserActive = await this.authService.isUserActive(req.user.user_username);
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
        } else if (req.user == 0) {
            return "INV_CRED"
        } 
        
        
    }

}