import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import 'dotenv/config';
import { JwtAuthGuard } from './auth/jwt-auth-guard.js';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true
  });

  const port = configService.get<number>('NESTJS_SERVER_PORT');
  await app.listen(port!);
  console.log(chalk.magenta("< NESTJS >: SERVIDOR CORRIENDO EN: http://localhost:"+ port));
}

bootstrap();
