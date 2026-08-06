import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../_prisma_nestjs/prisma.service.js';
import { UnboxUnique } from '../.utils/Unbox.js';
import QRCode from 'qrcode'
import * as fs from 'fs';

@Injectable()
export class ReagentService {
    constructor(private prisma : PrismaService) {}
    async fetchAllReagents () {
        const reagents = await this.prisma.reagents.findMany();
        return reagents;
    }

    async getReagent(reagent_id:number){
        const reagent = await this.prisma.reagents.findUnique({
            where: {reagent_id: reagent_id}
        })
        if(reagent == null)
            new HttpException("ERR_REAGENT_NOT_FOUND", HttpStatus.NOT_FOUND)
        return reagent;
    }

    async generateCode(reagentId:number):Promise<string>{
        let reagentCode: string = "";
        let reagent: any;

        reagent = await this.prisma.reagents.findUnique({
            where: {reagent_id: reagentId}
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
            else {
                isDuplicate = false;
            }
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