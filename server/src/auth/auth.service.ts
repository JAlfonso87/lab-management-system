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
        console.log(user)
        const payload = { sub: user.user_id, username: user.user_username };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
        
    async validateUser(username: string, password: string){
        if(!username || !password)
            throw new HttpException('ERR_EMPTY_FIELDS_DETECTED', HttpStatus.BAD_REQUEST)

        const user = await this.userService.findUser(username);

        if(!user)
            throw new HttpException('ERR_INVALID_CREDENTIALS', HttpStatus.BAD_REQUEST)

        const isPwdValid = await bcrypt.compare(password, user.user_password);
        if(isPwdValid) {
            return user;
        }
    }

}       