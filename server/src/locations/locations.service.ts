import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../_prisma_nestjs/prisma.service.js";

@Injectable()
export class LocationsService {
    constructor(private prisma: PrismaService){}

    async getLocationID(locationType:string, locationData:object){
        let locationID:number = 0;

        if(locationType == "LAB") {
            const { lab_name } = locationData as { lab_name: string };
            const lab = await this.prisma.labs.findUnique({
                where: { lab_name: lab_name },
                select: { lab_id: true }
            });
            if(lab == null)
                throw new HttpException("ERR_LOCATION_NOT_FOUND", HttpStatus.NOT_FOUND)
            else
                locationID = lab.lab_id;

        } else if (locationType == "SHELF_LVL") {
            const { host_building, shelf_lvl_number, shelf_number } = locationData as { host_building: string, shelf_lvl_number: number, shelf_number: number };
            const shelf = await this.prisma.shelves.findUnique({
                where: { 
                    host_building_shelf_number: {
                        host_building: host_building,
                        shelf_number: shelf_number
                    }
                },
                select: { shelf_id: true }
            })
            if(shelf == null)
                throw new HttpException("ERR_LOCATION_NOT_FOUND", HttpStatus.NOT_FOUND);
            
            const sh_lvl = await this.prisma.shelf_levels.findUnique({
                where: { 
                    shelf_id_shelf_level_number: {
                        shelf_id: shelf.shelf_id,
                        shelf_level_number: shelf_lvl_number
                    }
                },
                select: { shelf_level_id: true }
            })

            console.log("SHELF_LVL: " + sh_lvl)

            if(sh_lvl == null)
                throw new HttpException("ERR_LOCATION_NOT_FOUND", HttpStatus.NOT_FOUND);
            else
                locationID = sh_lvl.shelf_level_id;

        } 
        else 
            throw new HttpException("ERR_INVALID_LOCATION_TYPE", HttpStatus.BAD_REQUEST);
        
        return locationID;
    }

    async getLocalStock(location_id: number, reagent_id: number) {
        const local_stock = await this.prisma.local_stocks.findUnique({
            where: {
                reagent_id_location_id: {
                    reagent_id: reagent_id,
                    location_id: location_id
                }
            },
            select: {
                local_stock_id: true
            }
        })

        return !local_stock ? 0 : local_stock.local_stock_id
    }

    async getLabInventory(lab_name: string){
        const lab_id: Promise<number> = this.getLocationID("LAB", { lab_name: lab_name });
        const inventory = this.prisma.local_stocks.findMany({
            where: { location_id: Number(lab_id)}
        })
        return inventory;
    }

    async getShelfInventory(host_building: string, shelf_number: number, shelf_level?: number){
        let selected_location_id: { shelf_id: number } | null;
        console.log(shelf_level);
        selected_location_id = await this.prisma.shelves.findUnique({
            where: {
                host_building_shelf_number: {
                    host_building: host_building,
                    shelf_number: shelf_number
                }
            },
            select: { shelf_id: true }
        })

        if(selected_location_id == null)
            throw new HttpException("ERR_LOCATION_NOT_FOUND", HttpStatus.NOT_FOUND);

        if(shelf_level != undefined){
            const sh_lvl = await this.prisma.shelf_levels.findUnique({
                where: { 
                    shelf_id_shelf_level_number: {
                        shelf_id: selected_location_id.shelf_id,
                        shelf_level_number: shelf_level
                    }
                },
                select: { shelf_level_id: true },
            })

            const inventory = await this.prisma.$transaction(async (tx) => {
                const local_stocks = await tx.local_stocks.findMany({
                    where: { 
                        location_id: sh_lvl?.shelf_level_id
                    },
                    select: {
                        reagent_id: true,
                        local_stock_units: true
                    }
                })

                const reagent_data = await tx.reagents.findMany({
                    where: { reagent_id: { in: local_stocks.map(local_stock => local_stock.reagent_id) } },
                })

                let entries: {}[] = [];
                for(const local_stock of local_stocks){
                    const reagent_holder = reagent_data.shift();
                    entries.push(Object.assign({}, local_stock, reagent_holder))
                }

                return entries;
            })

            return inventory;
        }
        else {
            const sh_lvls: { shelf_level_id: number }[] = await this.prisma.shelf_levels.findMany({
                where: { shelf_id: selected_location_id.shelf_id },
                select: { shelf_level_id: true },
            })

            const inventory = await this.prisma.$transaction(async (tx) => {
                const local_stocks: { reagent_id: number, local_stock_units: number | null }[] = await tx.local_stocks.findMany({
                    where: { 
                        location_id: { in: sh_lvls.map(sh_lvl => sh_lvl.shelf_level_id) }
                    },
                    select: {
                        reagent_id: true,
                        local_stock_units: true
                    }
                })

                const reagent_data: {
                    reagent_id: number,
                    reagent_name: string, 
                    reagent_brand: string,
                    reagent_netweight: string, 
                    reagent_risk: string | null,
                    reagent_code: string | null
                }[] = await tx.reagents.findMany({
                    where: { 
                        reagent_id: { 
                            in: local_stocks.map(local_stock => local_stock.reagent_id) 
                        } 
                    },
                })

                let entries: {}[] = [];
                for(const local_stock of local_stocks){
                    const reagent_holder = reagent_data.shift();
                    entries.push(Object.assign({}, local_stock, reagent_holder))
                }
                console.log(entries)
                return entries
            })

            return inventory;
        }
    }
}