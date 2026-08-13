import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../_prisma_nestjs/prisma.service.js";
import { LocationsService } from "../locations/locations.service.js";

@Injectable()
export class OperationsService {
    constructor(private prisma: PrismaService, private locationsService: LocationsService){}

    async NewRestock(
        data: [
            locationData: { host_building: string, shelf_number: number, shelf_lvl_number: number },
            reagentData: { reagent_id: number, reagent_units: number } ,
            user: { userId: number, username: string}
        ]
    ) {
        const { host_building, shelf_number, shelf_lvl_number } = data[0];
        const { reagent_id, reagent_units } = data[1]
        const { userId, username } = data[2];
        const location_id: number = Number(await this.locationsService.getLocationID("SHELF_LVL", { host_building, shelf_lvl_number, shelf_number }));
        console.log(location_id)
        const local_stock_id = await this.locationsService.getLocalStock(location_id, reagent_id);

        const affected_stock = await this.prisma.local_stocks.upsert({
            where: { local_stock_id: local_stock_id},
            create: {
                location_id: location_id,
                reagent_id: reagent_id, 
                local_stock_units: reagent_units
            },
            update: {
                local_stock_units: { increment: reagent_units }
            }
        })
        
        const restock_log = await this.prisma.restocks.create({
            data: {
                reagent_id: reagent_id,
                user_id: userId,
                local_stock_id: affected_stock.local_stock_id,
                restock_units: reagent_units,
                restock_date: new Date()
            }
        })

        return restock_log;
    }
}