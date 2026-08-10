import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { Authorized_Roles } from "../_nestjs_decorators/roles.decorator.js";
import { LocationsService } from "./locations.service.js";

@Controller('locations')
@Authorized_Roles(['ADMIN'])
export class LocationsController {
    constructor(private readonly locationsService: LocationsService){}
    
    @Get(':host_building/shelf')
    async getShelfInventory(
        @Param('host_building') host_building: string,
        @Query('local_id') shelf_number: number,
        @Query('level') shelf_lvl_number?: number
    ) {
        const result = await this.locationsService.getShelfInventory(host_building, Number(shelf_number), shelf_lvl_number == undefined? undefined : Number(shelf_lvl_number));
        console.log(result)
        return result
    }
}