import { Injectable } from '@nestjs/common';
import { PrismaService } from '../_prisma_nestjs/prisma.service.js';
import { UnboxUnique } from '../.utils/Unbox.js';

@Injectable()
export class ReagentService {
    constructor(private prisma : PrismaService) {}
    async fetchAllReagents () {
        const reagents = await this.prisma.reagents.findMany();
        return reagents;
    }

    async fetchByRisk (type : string) {
        const reagents = await this.prisma.reagents.findMany({
            where: {reagent_risk: type}
        });
        return reagents;
    }

    async newEntry(newEntryParams: any) {
        console.log(arguments);
        const {reagentData, locationDiscriminator, locationData, stockParameter} = newEntryParams;

        // DESTRUCTURACIÓN DE DATOS
        const { reagent_name, reagent_brand, reagent_netweight, reagent_risk } = reagentData;
        const { location_type } = locationDiscriminator;
        const { stock_diff } = stockParameter;

        // EVALUACIÓN DE EXISTENCIA DE REGISTRO DE REACTIVO
        let reagent_id = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw`CALL reagentExists(${reagent_name}, ${reagent_brand}, ${reagent_netweight}, ${reagent_risk}, @checkResult);`
            return UnboxUnique(await tx.$queryRaw<number>`SELECT @checkResult AS reagent_id`);
        })

        // DEFINICIÓN DE ENTRADA NUEVA DE REACTIVO
        if(reagent_id == -1){
            await this.prisma.$transaction(async(tx) => {
                await tx.reagents.create({
                    data: {
                        reagent_name: reagent_name,
                        reagent_brand: reagent_brand,
                        reagent_netweight: reagent_netweight,
                        reagent_risk: reagent_risk
                    }
                });
                reagent_id = UnboxUnique(await tx.$queryRaw<number>`SELECT LAST_INSERT_ID() AS reagent_id`);
            })
        }
        
        
        // DESTRUCTURACIÓN DE DATOS DE UBICACIÓN Y OBTENCIÓN DE ID
        let location_id = -1;
        if(location_type == "lab"){
            const { lab_name } = locationData;
            await this.prisma.$transaction(async (tx) => {
                await tx.$executeRaw<number>`CALL get_lab_id(${lab_name}, @location_id);`
                location_id = UnboxUnique(await tx.$queryRaw`SELECT @location_id AS location_id;`);
            })
        }
        if(location_type == "shelf"){
            const { shelf_level_number, shelf_category } = locationData;
            await this.prisma.$transaction(async (tx) => {
                await tx.$executeRaw`CALL get_shelf_level_id(${shelf_level_number}, ${shelf_category}, @location_id);`
                location_id = UnboxUnique(await tx.$queryRaw`SELECT @location_id AS location_id;`);
            })
        }

        const result = await this.prisma.local_stocks.upsert({
           where: {
                reagent_id_location_id: {
                    reagent_id: reagent_id,
                    location_id: location_id,
                }
            },
            update: {
                local_stock_units: {
                    increment: stock_diff,
                }
            },
            create: {
                reagent_id: reagent_id,
                location_id: location_id,
                local_stock_units: stock_diff,
            },
        })
        
        return result;
    }
}