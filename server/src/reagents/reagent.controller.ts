import { Controller, Get, Param, Body, Query } from '@nestjs/common';
import { ReagentService } from './reagent.service.js';
import { Authorized_Roles } from '../_nestjs_decorators/roles.decorator.js';

@Authorized_Roles(['ADMIN'])
@Controller('reagents')
export class ReagentController {
  constructor(private readonly reagentService: ReagentService) {}

  @Get('all')
  getAllReagents(): Promise<any> {
    return this.reagentService.getPaginatedReagents();
  }

  @Authorized_Roles(['USER'])
  @Get()
  getReagents(
    @Query('risk') risk: string | undefined,
    @Query('page') page: Number,
    @Query('loc') loc: string,
  ) {
    return this.reagentService.getPaginatedReagents(Number(page), risk, loc);
  }

  @Authorized_Roles(['USER'])
  @Get('/reagent/:id')
  getReagent(@Param('id') id: string): Promise<any> {
    return this.reagentService.getReagent({ reagent_id: Number(id) });
  }

  @Authorized_Roles(['USER'])
  @Get('/code')
  getReagentByCode(@Query('code') code: string) {
    console.log(code);
    return this.reagentService.getReagent({ reagent_code: code });
  }

  @Authorized_Roles(['USER'])
  @Get('/risk')
  getReagentsByRisk(@Query('risk') reagent_risk: string) {
    return this.reagentService.getReagentsBySpecs({
      reagent_risk: reagent_risk,
    });
  }

  @Authorized_Roles(['USER'])
  @Get('/count')
  getReagentCount(@Query('risk') risk, @Query('loc') loc) {
    return this.reagentService.getCount({ risk: risk, lid: loc });
  }
}
