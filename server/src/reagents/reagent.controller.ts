import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ReagentService } from './reagent.service.js';

@Controller('reagents')
export class ReagentController{
    constructor(private readonly reagentService : ReagentService) {}
    
    @Get('all')
    fetchAllReagents() : Promise<any> {
        return this.reagentService.fetchAllReagents();
    }

    @Get('risk/:id')
    fetchByRisk(@Param('id') id : string) : Promise<any> {
        return this.reagentService.fetchByRisk(id)
    }

    @Post('new_entry')
    newEntry(@Body() newEntryParams:any ) : Promise<any> {
        return this.reagentService.newEntry(newEntryParams)
    }

}