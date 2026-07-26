import { Module } from '@nestjs/common';
import { PrismaModule } from '../_prisma_nestjs/prisma.module.js'
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

@Module({
    imports: [ PrismaModule ],
    controllers: [ UserController ],
    providers: [ UserService ],
    exports: [ UserService ]
})
export class UserModule {}