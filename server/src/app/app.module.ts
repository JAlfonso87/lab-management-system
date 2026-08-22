import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module.js';
import { ReagentModule } from '../reagents/reagent.module.js'
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { OperationsModule } from '../operations/operations.module.js';
import { LocationsModule } from '../locations/locations.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.js';
import { PrismaModule } from '../_prisma_nestjs/prisma.module.js';

@Module({
  imports: [
    PrismaModule,
    UserModule, 
    ReagentModule, 
    AuthModule, 
    OperationsModule, 
    LocationsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    })],                              
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
