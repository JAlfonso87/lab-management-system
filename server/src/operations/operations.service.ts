import { Injectable } from "@nestjs/common";
import { Prisma } from "../_prisma_generated/client.js";
import { PrismaService } from "../_prisma_nestjs/prisma.service.js";
import { LocationsService } from "../locations/locations.service.js";
import { ReagentService } from "../reagents/reagent.service.js";

@Injectable()
export class OperationsService {
    constructor(private prisma: PrismaService, private locationsService: LocationsService, private reagentService: ReagentService){}

    async newLocalStock (reagent_id: number, location_id: number, tx: Prisma.TransactionClient) {
        const local_stock = await tx.local_stocks.create({
            data: {
                reagent_id: reagent_id,
                location_id: location_id,
                local_stock_units: 0
            }
        })

        return local_stock;
    }

    async newReagentOperation(
        reagent_registration_payload: {
            reagent_data: {
                reagent_name: string,
                reagent_brand: string,
                reagent_netweight: string,
                reagent_risk: string,
            },
            location_data: {
                host_building: string,
                shelf_id: number,
                shelf_level_id: number
            },
            operation_data: {
                stock_units: number
            }
        }
    ) {
        const {reagent_data, location_data, operation_data} = reagent_registration_payload;

        // DESTRUCTURACIÓN DE DATOS
        const { reagent_name, reagent_brand, reagent_netweight, reagent_risk } = reagent_data;
        const { host_building, shelf_id, shelf_level_id } = location_data;
        const { stock_units } = operation_data;

        const result = await this.prisma.$transaction(async (tx) => {
            // EVALUACIÓN DE EXISTENCIA DE REGISTRO DE REACTIVO
            const reagentExists = await this.reagentService.exists(reagent_data);

            let created: {
                        reagent_id: number,
                        reagent_name: string,
                        reagent_brand: string,
                        reagent_netweight: string,
                        reagent_risk: string | null,
                        reagent_code: string | null
                    } | null;

            // DEFINICIÓN DE ENTRADA NUEVA DE REACTIVO
            if(reagentExists == 0){
                created = await tx.reagents.create({
                    data: {
                        reagent_name: reagent_name,
                        reagent_brand: reagent_brand,
                        reagent_netweight: reagent_netweight,
                        reagent_risk: reagent_risk
                    }
                })

                let code = await this.reagentService.generateCode(created);
                await tx.reagents.update({
                    where: { reagent_id: created.reagent_id },
                    data: { reagent_code: code }
                })
            }  
            else 
                created = reagentExists;
            
            // CREACIÓN DEL STOCK LOCAL
            await this.newLocalStock(created.reagent_id, shelf_level_id, tx);

            // ACTUALIZACIÓN DE LAS UNIDADES
            await tx.local_stocks.upsert({
                where: {
                    reagent_id_location_id: {
                        reagent_id: created!.reagent_id,
                        location_id: shelf_level_id,
                    }
                },
                update: {
                    local_stock_units: {
                        increment: stock_units,
                    }
                },
                create: {
                    reagent_id: created!.reagent_id,
                    location_id: shelf_level_id,
                    local_stock_units: stock_units,
                },
            })

            return "OK";
        })
        
        return result;
    }

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