import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module.js';
import { ReagentModule } from '../reagents/reagent.module.js'
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ReagentModule, AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    })],                              
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
