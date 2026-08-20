import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service.js";
import bcrypt from "bcrypt";
import { Console } from "console";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async generateToken(user : any): Promise<any> {
        const payload = { sub: user.user_id, username: user.user_username };
        return this.jwtService.sign(payload);
    }

    async isUserActive(username: string) {
        const status = await this.userService.findUser(username);
        return status!.user_status;
    }

    async validateUser(username: string, password: string){
        if(!username || !password)
            throw new HttpException('ERR_EMPTY_FIELDS_DETECTED', HttpStatus.BAD_REQUEST)

        const user = await this.userService.findUser(username);

        if(!user)
            throw new HttpException('ERR_INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED)
        

        const isPwdValid = await bcrypt.compare(password, user.user_password);

        if(isPwdValid) 
            return user;
        else 
            throw new HttpException('ERR_INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED)        
            
    }

}       