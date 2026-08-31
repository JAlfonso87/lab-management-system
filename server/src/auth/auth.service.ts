import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service.js";
import bcrypt from "bcrypt";
import { PrismaService } from "../_prisma_nestjs/prisma.service.js";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async getAdminCheck(
        user: {
            userId: number,
            username: string,
            permissions: string[]
        }
    )
    {
        const user_role = await this.prisma.users.findUnique({
            where: {
                user_id: user.userId
            },
            select: {
                roles: {
                    select: {
                        role_id: true
                    }
                }
            }
        })

        return user_role?.roles.role_id == 1 ? true : false;
    }

    async generateToken(user : any): Promise<any> {
        const payload = { 
            sub: user.user_id, 
            username: user.user_username,
            permissions: user.permissions 
        };
        return this.jwtService.sign(payload);
    }

    async isUserActive(userId: number) {
        const status = await this.userService.getUserByID(Number(userId));
        return status!.user_status;
    }

    async validateUser(username: string, password: string){
        if(!username || !password)
            throw new HttpException('ERR_EMPTY_FIELDS_DETECTED', HttpStatus.BAD_REQUEST)

        const user = await this.prisma.users.findUnique({
            where: {
                user_username: username
            },
            include: {
                roles: {
                    select: {
                        role_id: true,
                        role_name: true,
                        roles_permissions: {
                            select: {
                                permissions: {
                                    select: {
                                        permission_name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if(!user)
            throw new HttpException('ERR_INVALID_CREDENTIALS', HttpStatus.BAD_REQUEST)
        
        const permissions = user!.roles.roles_permissions.map((element) => {
            return element.permissions.permission_name
        })

        Object.assign(user, user, {"permissions": permissions})

        const isPwdValid = await bcrypt.compare(password, user.user_password);

        if(isPwdValid) 
            return user;
        else 
            throw new HttpException('ERR_INVALID_CREDENTIALS', HttpStatus.BAD_REQUEST)        
            
    }

}       