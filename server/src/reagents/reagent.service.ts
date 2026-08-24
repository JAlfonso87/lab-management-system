import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../_prisma_nestjs/prisma.service.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';import QRCode from 'qrcode'

@Injectable()
export class ReagentService {
    constructor(private readonly prisma : PrismaService) {}

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
                    const { shelf_id, ...cleanEntry } = entry;
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

    async getReagent(params: { reagent_id: number } | { reagent_code: string }): Promise<any> {
        let reagent: {
            reagent_id: number,
            reagent_name: string,
            reagent_brand: string,
            reagent_netweight: string,
            reagent_risk: string | null,
            reagent_code: string | null
        } | null;

        if(Object.hasOwn(params, "reagent_id")){
            let { reagent_id } = params as { reagent_id: number}
            reagent = await this.prisma.reagents.findUnique({
                where: { reagent_id: reagent_id }
            })
        } else if (Object.hasOwn(params, "reagent_code")) {
            let { reagent_code } = params as { reagent_code: string}
            reagent = await this.prisma.reagents.findUnique({
                where: { reagent_code: reagent_code }
            })
        }
            
        if(reagent! == null)
            throw new HttpException("ERR_REAGENT_NOT_FOUND", HttpStatus.NOT_FOUND)

        const locations = await this.getReagentLocations(reagent!.reagent_id);

        const totalStock = await this.getReagentTotalStock(reagent!.reagent_id);

        return Object.assign({}, { "reagent": reagent }, { "total_stock": totalStock }, { "locations": locations });
    }

    async getReagents (pageNumber?: number, risk?: string) {
        let reagents: { reagent_id: number }[] = []
            if(pageNumber){
                reagents = await this.prisma.reagents.findMany({
                    where: risk != null? { reagent_risk: risk } : {},
                    skip: (pageNumber - 1) * 10,
                    take: 10
                })
            }
            else {
                reagents = await this.prisma.reagents.findMany({
                    where: risk != undefined? { reagent_risk: risk } : {},
                    select: { reagent_id: true },
                })
            }

            let holder: {}[] = [];
            let reagentEntry = {};

            for (const reagent of reagents) {
                reagentEntry = await this.getReagent({"reagent_id": reagent.reagent_id});
                holder.push(reagentEntry)
            }

        return holder;
    }

    async getReagentBySpecs(
        reagentSpecs: 
            { reagent_name: string, reagent_brand: string, reagent_netweight: string, reagent_risk: string } |
            { reagent_code: string }
    ) {
        console.log(reagentSpecs)
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

    async generateCode(params: { reagentId: number }  | { reagent_name: string, reagent_brand: string, reagent_netweight: string, reagent_risk: string | null }): Promise<string>{
        
        let reagentCode: string = "";
        let reagent: any;

        if(Object.hasOwn(params, "reagentId"))
        {
            const { reagentId } = params as { reagentId: number};
            reagent = await this.prisma.reagents.findUnique({
                where: { reagent_id: reagentId }
            });
        }
        else
            reagent = params as { reagent_name: string, reagent_brand: string, reagent_netweight: string, reagent_risk: string }

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

            const desktopPath = path.join(os.homedir(), 'Desktop', 'QRs');
            const buffer = Buffer.from(base64Data, 'base64');

            fs.mkdirSync(desktopPath, { recursive: true });

            const filePath = path.join(desktopPath, `${reagentCode}.png`);

            fs.writeFileSync(filePath, buffer);
        } catch (err) {
            console.error('Failed to generate QR code:', err);
            throw new TypeError("ERROR");
        }
    }

    async exists(
        reagent_data:{
            reagent_name: string,
            reagent_brand: string,
            reagent_netweight: string,
            reagent_risk: string
        }
    ) {
        const reagent = await this.prisma.reagents.findFirst({
            where: {
                reagent_name: reagent_data.reagent_name,
                reagent_brand: reagent_data.reagent_brand,
                reagent_netweight: reagent_data.reagent_netweight,
                reagent_risk: reagent_data.reagent_risk
            }
        })

        return reagent ? reagent : 0;
    }
}