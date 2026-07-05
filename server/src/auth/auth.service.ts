import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service.js";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async generateToken(user : any): Promise<any> {
        const payload = { sub: user.technician_id, username: user.technician_username };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
        
    async validateUser(username: string, password: string){
        if(!username || !password)
            throw new HttpException('Todos los campos son requeridos.', HttpStatus.BAD_REQUEST)

        const user = await this.userService.findOne(username);
        /* Si el usuario con el nombre de usuario provisto existe, y la contraseña
           del mismo se corresponde con la entregada por el solicitante, se aprueba la 
           condición. */

        if(!user)
            throw new HttpException('Usuario o contraseña inválidos.', HttpStatus.BAD_REQUEST)

        const isPwdValid = await bcrypt.compare(password, user.technician_password);
        if(isPwdValid) {
            return user;
        }
    }

}       