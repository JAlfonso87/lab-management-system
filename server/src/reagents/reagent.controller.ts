import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ReagentService } from './reagent.service.js';
import { Authorized_Roles } from '../_nestjs_decorators/roles.decorator.js';

@Authorized_Roles(['ADMIN'])
@Controller('reagents')
export class ReagentController{
    constructor(private readonly reagentService : ReagentService) {}
    
    @Get('all')
    getAllReagents() : Promise<any> {
        return this.reagentService.getPaginatedReagents();
    }

    @Get()
    getReagents(
        @Query('risk') risk: string | undefined,
        @Query('page') page: Number
    ) {
        return this.reagentService.getPaginatedReagents(Number(page), risk)
    }

    @Get('/reagent/:id')
    getReagent(@Param('id') id: string):Promise<any> {
        return this.reagentService.getReagent({"reagent_id": Number(id)});
    }

    @Get('/code')
    getReagentByCode(@Query('code') code: string) {
        console.log(code)
        return this.reagentService.getReagent({"reagent_code": code})
    }

    @Get('/risk')
    getReagentsByRisk(@Query('risk') reagent_risk: string){
        return this.reagentService.getReagentsBySpecs({"reagent_risk": reagent_risk})
    }

    @Get('/count')
    getReagentCount(){
        return this.reagentService.getCount()
    }
}