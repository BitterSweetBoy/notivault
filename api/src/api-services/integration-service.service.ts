import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIntegrationServiceDto } from './dtos/create-integration-service.dto';

@Injectable()
export class IntegrationServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIntegrationServiceDto) {
    const exists = await this.prisma.integrationService.findUnique({ where: { nombre: dto.nombre } });
    if (exists) throw new ConflictException('El servicio ya existe');

    return this.prisma.integrationService.create({ data: dto });
  }

  async findAll() {
    return this.prisma.integrationService.findMany();
  }
}
