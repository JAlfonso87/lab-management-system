import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../_prisma_nestjs/prisma.service.js';
import { UnboxUnique } from '../.utils/Unbox.js';
import QRCode from 'qrcode'
import * as fs from 'fs';

@Injectable()
export class ReagentService {
    constructor(private prisma : PrismaService) {}

    async getReagentLocations(reagent_id: number) {
        const locations = await this.prisma.local_stocks.findMany({
            where: { reagent_id: reagent_id },
            select: { 
                location_id: true,
                local_stock_units: true 
            }
        });

        const storageData = async () => {
            const shelfLevelData = await this.prisma.shelf_levels.findMany({
                where: { shelf_level_id: { in: locations.map(location => location.location_id)}},
                select: { 
                    shelf_level_id: true,
                    shelf_id: true,
                    shelf_level_number: true
                },
                orderBy: [
                    { shelf_id: "asc"}, 
                    { shelf_level_number: "asc" }
                ]
            })

            if(shelfLevelData.length == 0)
                return null;

            const shelfData = await this.prisma.shelves.findMany({
                where: { shelf_id: { in: shelfLevelData.map(level => Number(level.shelf_id))}},
                select: {
                    shelf_id: true,
                    host_building: true,
                    shelf_number: true
                },
                orderBy: { shelf_id: "asc" }
            })

            const data: {}[] = shelfLevelData.map(shelfLevel => {
                    const entry = Object.assign(
                        {}, 
                        shelfData.find(shelf => shelfLevel.shelf_id == shelf.shelf_id ), 
                        shelfLevel, 
                        { "local_stock_units": locations.find(location => location.location_id == shelfLevel.shelf_level_id)!.local_stock_units }
                    )
                    const { shelf_id, shelf_level_id, ...cleanEntry } = entry;
                    return cleanEntry;
                }
            )

            return data;
        }
        
        const locationData = await storageData();

        return locationData == null ? [] : locationData;
    }

    async getReagentTotalStock(reagent_id: number) {
        let total: number = 0;
        const local_stocks = await this.prisma.local_stocks.findMany({
            where: { reagent_id: reagent_id },
            select: { local_stock_units: true }
        })
        
        if(local_stocks){
            for (const local_stock of local_stocks)
                total += local_stock.local_stock_units!
        }

        return total;
    }

    async getReagent(reagent_id: number): Promise<any> {

        const reagent = await this.prisma.reagents.findUnique({
            where: { reagent_id: reagent_id }
        })
        if(reagent == null)
            new HttpException("ERR_REAGENT_NOT_FOUND", HttpStatus.NOT_FOUND)

        const locations = await this.getReagentLocations(reagent!.reagent_id);

        const totalStock = await this.getReagentTotalStock(reagent!.reagent_id);

        return Object.assign({}, { "reagent": reagent }, { "total_stock": totalStock }, { "locations": locations });
    }

    async getReagents (pageNumber?: number) {
        let reagents: { reagent_id: number }[] = []
            if(pageNumber){
                reagents = await this.prisma.reagents.findMany({
                    skip: (pageNumber - 1) * 10,
                    take: 10
                })
            }
            else {
                reagents = await this.prisma.reagents.findMany({
                    select: { reagent_id: true }
                })
            }

            let holder: {}[] = [];
            let reagentEntry = {};

            for (const reagent of reagents) {
                reagentEntry = await this.getReagent(reagent.reagent_id);
                console.log(reagentEntry)
                holder.push(reagentEntry)
            }

        return holder;
    }

    async getReagentBySpecs(
        reagentSpecs: 
            { reagent_name: string, reagent_brand: string, reagent_netweight: string, reagent_risk: string } |
            { reagent_code: string }
    ) {

        if('reagent_code' in reagentSpecs) {
            const reagent = await this.prisma.reagents.findUnique({where: { reagent_code: reagentSpecs.reagent_code }})
            
            if(!reagent)
                throw new HttpException("ERR_REAGENT_NOT_FOUND", HttpStatus.NOT_FOUND)
            else
                return reagent;

        } else {

            const reagent = await this.prisma.reagents.findFirst({
                where: {
                    reagent_name: reagentSpecs.reagent_name,
                    reagent_brand: reagentSpecs.reagent_brand,
                    reagent_netweight: reagentSpecs.reagent_netweight,
                    reagent_risk: reagentSpecs.reagent_risk
                }
            })

            if(!reagent)
                throw new HttpException("ERR_REAGENT_NOT_FOUND", HttpStatus.NOT_FOUND)
            else
                return reagent;
        }
    }

    async getReagentsBySpecs( specs: { reagent_risk: string } | { reagent_brand: string } ) {
        if("reagent_risk" in specs){
            const reagents = await this.prisma.reagents.findMany({
                where: { reagent_risk: specs.reagent_risk }
            });
            return reagents;
        } 
        
        if ("reagent_brand" in specs){
            const reagents = await this.prisma.reagents.findMany({
                where: { reagent_risk: specs.reagent_brand }
            });
            return reagents;
        }


    }

    async generateCode(reagentId:number):Promise<string>{
        let reagentCode: string = "";
        let reagent: any;

        reagent = await this.prisma.reagents.findUnique({
            where: { reagent_id: reagentId }
        });

        const words: string[] = reagent!.reagent_name.replaceAll(/[^a-zA-Z0-9\s]/g,"").trim().split(/\s+/);
        const segmentLength: number = (words.length <= 6) ? Math.floor(6 / words.length) : 1;
        const segment: string = words
            .map(word => word.substring(0, segmentLength))
            .join("");

        reagentCode += segment;

        reagentCode += (reagent!.reagent_brand == '' || reagent!.reagent_brand.length < 3) ? "GEN" : reagent!.reagent_brand.replaceAll(/[^a-zA-Z0-9]/g,"").substring(0,3);
        reagentCode += (reagent!.reagent_netweight.match(/^\d+/)?.[0] ?? "").padStart(4, "0");
        reagentCode += reagent!.reagent_risk!.charAt(0)

        let isDuplicate: boolean = false;

        do {
            reagent = await this.prisma.reagents.findUnique({
                where: { reagent_code: reagentCode },
                select: { reagent_code: true  }
            })
            
            if(reagent != null) {
                isDuplicate = true;
                reagentCode += Math.round(Math.random()*10)
            }
            else 
                isDuplicate = false;

        } while (isDuplicate == true)
        await this.generateQR(reagentCode)
        return reagentCode
    }

    async generateQR(reagentCode: string){
        try {
            const dataUrl = await QRCode.toDataURL(reagentCode, {
            errorCorrectionLevel: 'H', // Low (L), Medium (M), Quartile (Q), High (H)
            margin: 2,
            width: 300
            });
            
            const base64Data = dataUrl.split(",")[1];
            
            if (!base64Data) {
                throw new Error("Invalid data URL format");
            }

            const buffer = Buffer.from(base64Data, 'base64');

            fs.writeFileSync("C:\\Users\\JALFO\\Pictures\\QRs\\"+reagentCode+".png", buffer);
        } catch (err) {
            console.error('Failed to generate QR code:', err);
            throw new TypeError("ERROR");
        }
    }

    async newEntry(newEntryParams: {reagentData: {
            reagent_name: string,
            reagent_brand: string,
            reagent_netweight: string,
            reagent_risk: string
        },
        location_discriminator: {location_type: string},
        location_data: {lab_name: string} | {shelf_level_number: number, shelf_category: string},
        stock_parameter: {stock_diff: number}}
    
    ) {
        console.log(arguments);
        const {reagentData, location_discriminator, location_data, stock_parameter} = newEntryParams;

        // DESTRUCTURACIÓN DE DATOS
        const { reagent_name, reagent_brand, reagent_netweight, reagent_risk } = reagentData;
        const { location_type } = location_discriminator;
        const { stock_diff } = stock_parameter;

        // EVALUACIÓN DE EXISTENCIA DE REGISTRO DE REACTIVO
        const existingReagents = await this.prisma.reagents.findMany({
            where: {
                reagent_name: reagent_name,
                reagent_brand: reagent_brand,
                reagent_netweight: reagent_netweight,
                reagent_risk: reagent_risk
            }
        })

        let created: {
                    reagent_id: number,
                    reagent_name: string,
                    reagent_brand: string,
                    reagent_netweight: string,
                    reagent_risk: string | null,
                    reagent_code: string | null
                } | null;
        // DEFINICIÓN DE ENTRADA NUEVA DE REACTIVO
        if(existingReagents.length == 0)
            created = await this.prisma.reagents.create({
                data: {
                    reagent_name: reagent_name,
                    reagent_brand: reagent_brand,
                    reagent_netweight: reagent_netweight,
                    reagent_risk: reagent_risk
                }
            })
        else 
            created = existingReagents[0]
        
        // DESTRUCTURACIÓN DE DATOS DE UBICACIÓN Y OBTENCIÓN DE ID
        let foundLocation: any;
        if(location_type == "lab"){
            const { lab_name } = location_data as {lab_name: string};
            foundLocation = await this.prisma.labs.findUnique({
                where: {lab_name: lab_name},
                select: {lab_id:true}
            })
        }
        if(location_type == "shelf"){
            const { shelf_level_number, shelf_category } = location_data as {shelf_level_number: number, shelf_category: string};
            const foundShelves = await this.prisma.shelves.findMany({
                where: {
                    shelf_category: shelf_category
                }
            })
            foundLocation = await this.prisma.shelf_levels.findMany({
                where: {
                    shelf_level_number: shelf_level_number,
                    shelf_id: foundShelves[0].shelf_id
                },
                select: {shelf_level_id: true}
            })
            foundLocation = foundLocation.length != 0 ? foundLocation[0].shelf_level_id : null
        }

        const result = await this.prisma.local_stocks.upsert({
           where: {
                reagent_id_location_id: {
                    reagent_id: created!.reagent_id,
                    location_id: foundLocation,
                }
            },
            update: {
                local_stock_units: {
                    increment: stock_diff,
                }
            },
            create: {
                reagent_id: created!.reagent_id,
                location_id: foundLocation,
                local_stock_units: stock_diff,
            },
        })
        
        return result;
    }
}