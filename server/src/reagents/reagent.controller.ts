import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ReagentService } from './reagent.service.js';
import { Authorized_Roles } from '../_nestjs_decorators/roles.decorator.js';

@Authorized_Roles(['ADMIN'])
@Controller('reagents')
export class ReagentController{
    constructor(private readonly reagentService : ReagentService) {}
    
    @Get('all')
    getAllReagents() : Promise<any> {
        return this.reagentService.getReagents();
    }

    @Get()
    getReagents(
        @Query('risk') risk: string | undefined,
        @Query('page') page: Number
    ) {
        return this.reagentService.getReagents(Number(page), risk)
    }

    @Get('/reagent/:id')
    getReagent(@Param('id') id: string):Promise<any> {
        return this.reagentService.getReagent(Number(id));
    }

    @Get('/code')
    getReagentByCode(@Query('code') reagent_code: string) {
        return this.reagentService.getReagentBySpecs({"reagent_code": reagent_code})
    }

    @Get('/risk')
    getReagentsByRisk(@Query('risk') reagent_risk: string){
        return this.reagentService.getReagentsBySpecs({"reagent_risk": reagent_risk})
    }
}