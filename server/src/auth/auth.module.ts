import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy.js";
import { UserModule } from "../users/user.module.js";
import { LocalStrategy } from "./local.strategy.js";
import { ConfigService } from "@nestjs/config";
import { PrismaModule } from "../_prisma_nestjs/prisma.module.js";

@Module({
    imports: [ UserModule, 
               PassportModule,
               PrismaModule,
               JwtModule.registerAsync({
                    inject: [ConfigService],
                    useFactory: (configService:ConfigService) => ({
                        secret: configService.getOrThrow<string>('TKEY'),
                        signOptions: {expiresIn: '60m'}
                    })
               })
            ],
    controllers: [ AuthController ],
    providers: [ AuthService, JwtStrategy, LocalStrategy ]
})
export class AuthModule {}