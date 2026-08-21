import { Module } from "@nestjs/common";
import { PrismaModule } from "../_prisma_nestjs/prisma.module.js";
import { LocationsController } from "./locations.controller.js";
import { LocationsService } from "./locations.service.js";

@Module({
    imports: [ PrismaModule ],
    controllers: [ LocationsController ],
    providers: [ LocationsService ],
    exports: [ LocationsService ]
})
export class LocationsModule{}