import { Body, Controller, Get, Req, Post } from "@nestjs/common";
import { Authorized_Roles } from "../_nestjs_decorators/roles.decorator.js";
import { OperationsService } from "./operations.service.js";

@Controller('operations')
@Authorized_Roles(['ADMIN'])
export class OperationsController {
    constructor(private readonly operationsService: OperationsService){}

    @Authorized_Roles(['USER'])
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

    @Authorized_Roles(['USER'])
    @Post('/restock')
    newRestock(@Req() req, 
    @Body() 
        body: {
            stock_data: any, 
            reagent_data: { 
                reagent_id: number, 
                reagent_name: number 
            }
        }
    )
    {
        return this.operationsService.newRestockOperation(Object.assign({}, body, req.user));
    }

    @Authorized_Roles(['USER'])
    @Post('/transfer')
    newTransferOperation(@Req() req, @Body() body: { transferInformation: { source_id: number, destination_id: number, reagent_id: number, stock_units: number }}) {
        return this.operationsService.newTransferOperation(Object.assign({}, body, req.user))
    }

    @Authorized_Roles(['USER'])
    @Post('/request')
    newRequestOperation(
        @Req() req, 
        @Body() body: 
        {
            checkouts: [{
                local_stock_id: number,
                checkout_units: number
            }]
        }
    ){
        const request_information = {
            "checkouts": body.checkouts,
            "user": req.user
        }

        return this.operationsService.newRequestOperation(request_information);
    }


}