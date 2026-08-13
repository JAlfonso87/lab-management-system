import { Body, Controller, Get, Req, Post } from "@nestjs/common";
import { Authorized_Roles } from "../_nestjs_decorators/roles.decorator.js";
import { OperationsService } from "./operations.service.js";

@Controller('operations')
@Authorized_Roles(['ADMIN'])
export class OperationsController {
    constructor(private readonly operationsService: OperationsService){}

    @Post('/restock')
    newRestock(@Req() req, @Body() body: [{ host_building: string, shelf_lvl_number: number, shelf_number: number }, { reagent_id: number, reagent_units: number }, user: { userId: number, username: string }]){
        const user: { userId: number, username: string } = req.user;
        body.push(user);
        return this.operationsService.NewRestock(body);
    }
}