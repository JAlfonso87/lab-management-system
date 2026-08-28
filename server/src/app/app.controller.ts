import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PublicRoute } from '../_nestjs_decorators/public.decorator.js';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @PublicRoute()
  @Get()
  getHello(): string {
    return this.appService.getHealth();
  }
}
