import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { PublicRoute } from "./public-decorator.js";
import { LocalAuthGuard } from "./local-auth.guard.js";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @PublicRoute()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        return this.authService.generateToken(req.user);
    }

}