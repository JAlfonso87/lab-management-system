import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import 'dotenv/config';
import { JwtAuthGuard } from './auth/jwt-auth-guard.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  //dotenv.config()
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalGuards(new JwtAuthGuard(new Reflector()))
  const port = configService.get<number>('NESTJS_SERVER_PORT');
  await app.listen(port!);
  console.log("SERVIDOR CORRIENDO EN: http://localhost:"+ port);
}

bootstrap();
