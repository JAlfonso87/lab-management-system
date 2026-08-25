import { Body, Controller, Get, Req, Post } from "@nestjs/common";
import { Authorized_Roles } from "../_nestjs_decorators/roles.decorator.js";
import { OperationsService } from "./operations.service.js";

@Controller('operations')
@Authorized_Roles(['ADMIN'])
export class OperationsController {
    constructor(private readonly operationsService: OperationsService){}

    @Post('/new_reagent')
    newReagentOperation(@Body() body: 
        {
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
        return this.operationsService.newReagentOperation(body)
    }

    @Post('/restock')
    newRestock(@Req() req, @Body() body: {stock_data: [{ host_building: string, shelf_number: number, shelf_lvl_id: number, shelf_lvl_number: number, stock_diff: number}], reagent_data: { reagent_id: number, reagent_name: number }}){
        return this.operationsService.newRestockOperation(Object.assign({}, body, req.user));
    }

    @Post('/transfer')
    newTransferOperation(@Req() req, @Body() body: { transferInformation: { source_id: number, destination_id: number, reagent_id: number, stock_units: number }}) {
        console.log(req.user)
        return this.operationsService.newTransferOperation(Object.assign({}, body, req.user))
    }


}