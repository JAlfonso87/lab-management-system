import { IS_PUBLIC_KEY } from "../_nestjs_decorators/public.decorator.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../users/user.service.js";
import { PrismaService } from "../_prisma_nestjs/prisma.service.js";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
        private readonly prisma: PrismaService
    ){
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any>{
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(isPublic)
            return true;

        const authorizedRoles = this.reflector.getAllAndMerge('AUTHORIZED_ROLES', [
            context.getHandler(),
            context.getClass()
        ])

        await super.canActivate(context);

        const userPayload = context.switchToHttp().getRequest().user
        const user = await this.userService.findUser(userPayload.username)

        if(user)
        {
            const user_role= await this.prisma.roles.findUnique({
                where: { 
                    role_id: user.role_id 
                }
            })
            if (!user_role)
                throw new UnauthorizedException;
            
            return authorizedRoles.includes(user_role.role_name) ? true : false;

        }
        else
            return false
    }
};