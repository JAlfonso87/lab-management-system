import { Module } from "@nestjs/common";
import { PrismaModule } from "../_prisma_nestjs/prisma.module.js";
import { OperationsController } from "./operations.controller.js";
import { OperationsService } from "./operations.service.js";
import { LocationsModule } from "../locations/locations.module.js";

@Module({
    imports: [ PrismaModule, LocationsModule ],
    controllers: [ OperationsController ],
    providers: [ OperationsService ],
    exports: [ OperationsService ]
})
export class OperationsModule{}