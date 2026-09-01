import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

    async newRequestOperation (
        requestInformation: {
            checkouts: [{
                local_stock_id: number,
                checkout_units: number
            }],
            user: {
                userId: number,
                username: string
            }
        }
    )
    {
        const { checkouts, user } = requestInformation;
        const request = await this.prisma.$transaction(async (tx) => {
            const request_log = await tx.requests.create({
                data: {
                    user_id: user.userId,
                    request_date: new Date(),
                }
            });

            for(const checkout of checkouts){
                const updated_stock = await tx.local_stocks.update({ 
                    data: {
                        local_stock_units: { decrement: checkout.checkout_units }
                    },
                    where: { local_stock_id: checkout.local_stock_id }
                })
                await tx.request_details.create({
                    data: {
                        request_id: request_log.request_id,
                        local_stock_id: updated_stock.local_stock_id,
                        requested_units: checkout.checkout_units
                    }
                })
            };
        })

        return request;
    }

    async newTransferOperation(
        transferInformation: {
            source_id: number,
            destination_id: number,
            reagent_id: number,
            stock_units: number
            userId: number,
            username: string
        }
    )
    {
        const transfer = await this.prisma.$transaction(async (tx) => {
            const {source_id, destination_id, reagent_id, stock_units, userId, username} = transferInformation;
            const now = new Date();

            let source_stock = await tx.local_stocks.findUnique({
                where: { 
                    reagent_id_location_id: {
                        reagent_id: reagent_id,
                        location_id: source_id
                    }
                }
            })

            let destination_stock = await tx.local_stocks.findUnique({
                where: { 
                    reagent_id_location_id: {
                        reagent_id: reagent_id,
                        location_id: destination_id
                    }
                }
            })

            if(!source_stock)
                throw new HttpException("ERR_SOURCE_NOT_FOUND", HttpStatus.NOT_FOUND)

            if(!destination_stock)
                await this.newLocalStock(reagent_id, destination_id, tx);

            source_stock = await tx.local_stocks.update({
                data: {
                    local_stock_units: {
                        decrement: Number(stock_units)
                    }
                },
                where: {
                    reagent_id_location_id: {
                        reagent_id: reagent_id,
                        location_id: source_id
                    }
                }
            })

            await tx.transfer.create({
                data: {
                    reagent_id: reagent_id, 
                    local_stock_id: source_stock.local_stock_id,
                    user_id: userId,
                    transfer_type: "OUT",
                    stock_difference: stock_units,
                    transfer_date: new Date()
                }
            })

            destination_stock = await tx.local_stocks.update({
                data: {
                    local_stock_units: {
                        increment: Number(stock_units)
                    }
                },
                where: {
                    reagent_id_location_id: {
                        reagent_id: reagent_id,
                        location_id: destination_id
                    }
                }
            })

            await tx.transfer.create({
                data: {
                    reagent_id: reagent_id, 
                    local_stock_id: destination_stock.local_stock_id,
                    user_id: userId,
                    transfer_type: "IN",
                    stock_difference: stock_units,
                    transfer_date: new Date()
                }
            })

        })

        return transfer;
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

    async newRestockOperation(
        data: {
            stock_data: any,
            reagent_data: { 
                reagent_id: number, 
                reagent_name: number 
            },
            userId: number, 
            username: string
        }
    ) {
        const shelf_level_data = data.stock_data;

        const restock = await this.prisma.$transaction(async (tx) => {

            const shelfLevels = await tx.shelf_levels.findMany({
                where: {
                    shelf_level_id: {
                        in: shelf_level_data.map((element) => element.shelf_level_id)
                    }
                }
            });

            const locationIds = [
                ...shelfLevels.map(element => element.shelf_level_id),
            ];

            let found_local_stocks: any[] = await tx.local_stocks.findMany({
                where: {
                    reagent_id: data.reagent_data.reagent_id,
                    location_id: {
                        in: locationIds
                    }
                }
            })

            const pendingLocationIds = locationIds.filter((id) => 
                !found_local_stocks.map(
                    (found_local_stock) => found_local_stock.location_id
                ).includes(id)
            )

            if(pendingLocationIds.length != 0){
                await tx.local_stocks.createMany({ 
                    data: pendingLocationIds.map((id) => ({
                        reagent_id: data.reagent_data.reagent_id,
                        location_id: id
                    }))
                });

                const new_local_stocks = await tx.local_stocks.findMany({
                    where: {
                        reagent_id: data.reagent_data.reagent_id,
                        location_id: { in: pendingLocationIds }
                    }
                })

                found_local_stocks = [...found_local_stocks, ...new_local_stocks];
            }

            for(const stock of data.stock_data){
                const update = await tx.local_stocks.update({
                    data: { local_stock_units: { increment: Number(stock.stock_diff) } },
                    where: {
                        reagent_id_location_id: {
                            reagent_id: data.reagent_data.reagent_id,
                            location_id: stock.shelf_level_id
                        }
                    }
                })

                await tx.restocks.create({
                    data: {
                        reagent_id: data.reagent_data.reagent_id,
                        user_id: data.userId,
                        local_stock_id: update.local_stock_id,
                        restock_units: Number(stock.stock_diff),
                        restock_date: new Date()
                    }
                })
                
            }
        })

        return restock;
    }
}