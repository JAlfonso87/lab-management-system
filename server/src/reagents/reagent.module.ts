import { Module } from '@nestjs/common';
import { PrismaModule } from '../_prisma_nestjs/prisma.module.js';
import { ReagentController } from './reagent.controller.js';
import { ReagentService } from './reagent.service.js';

@Module({
    imports: [ PrismaModule ],
    controllers: [ ReagentController ],
    providers: [ ReagentService ],
    exports: [ ReagentService ]
})

export class ReagentModule {}