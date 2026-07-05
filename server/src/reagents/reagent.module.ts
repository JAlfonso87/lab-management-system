import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ReagentController } from './reagent.controller.js';
import { ReagentService } from './reagent.service.js';

@Module({
    imports: [ PrismaModule ],
    controllers: [ ReagentController ],
    providers: [ ReagentService ]
})

export class ReagentModule {}