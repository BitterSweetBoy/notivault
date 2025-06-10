import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { IntegrationServiceService } from './integration-service.service';
import { CreateIntegrationServiceDto } from './dtos/create-integration-service.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('integration-services')
export class IntegrationServiceController {
  constructor(private readonly service: IntegrationServiceService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateIntegrationServiceDto) {
    return this.service.create(dto);
  }
}
