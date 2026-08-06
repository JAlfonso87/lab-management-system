import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service.js";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super();
    }

    async validate(username:string, password:string){
        const user = await this.authService.validateUser(username, password);
        if(!user || user.user_status == 0){
            throw new HttpException('SU CUENTA ESTÁ PENDIENTE DE VALIDACIÓN. POR FAVOR, CONTACTE A UN ADMINISTRADOR PARA SU ACTIVACIÓN.', HttpStatus.FORBIDDEN);
        }
        return user;
    }
}