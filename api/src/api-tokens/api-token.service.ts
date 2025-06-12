import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApiTokenDto } from './dtos/create-api-token.dto';
import { UpdateApiTokenDto } from './dtos/update-api-token.dto';
import { ApiTokenResponseDto } from './dtos/api-token-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ApiTokenService {

  constructor(private readonly prisma: PrismaService) {}

  /** Devuelve todos los tokens mapeados a DTO */
  async findAll(): Promise<ApiTokenResponseDto[]> {
    const tokens = await this.prisma.apiToken.findMany({
      where: { activo: true },
      include: { integrationService: true },
      orderBy: { fechaConfiguracion: 'desc' },
    });
    return tokens.map(t => this.toResponseDto(t));
  }

  /** Busca uno por id, lanza NotFound si no existe */
  async findOne(id: string): Promise<ApiTokenResponseDto> {
    const token = await this.prisma.apiToken.findFirst({
      where: { id, activo: true },
      include: { integrationService: true },
    });
    if (!token) throw new NotFoundException('Token no encontrado');
    return this.toResponseDto(token);
  }

  /** Crea un nuevo token y devuelve el DTO */
  async create(dto: CreateApiTokenDto): Promise<ApiTokenResponseDto> {
    const now = new Date();
    const token = await this.prisma.apiToken.create({
      data: {
        ...dto,
        fechaConfiguracion: now,
        ultimaModificacion: now,
        ultimaVerificacion: now,
      },
      include: { integrationService: true },
    });
    return this.toResponseDto(token);
  }

  /** Actualiza el token y devuelve el DTO */
  async update(
    id: string,
    dto: UpdateApiTokenDto,
  ): Promise<ApiTokenResponseDto> {
    await this.findOne(id);
    const updated = await this.prisma.apiToken.update({
      where: { id },
      data: {
        ...dto,
        ultimaModificacion: new Date(),
      },
      include: { integrationService: true },
    });
    return this.toResponseDto(updated);
  }

  /** Marca como inactivo el token */
  async deactivate(id: string): Promise<void> {
    // verifica existencia
    await this.findOne(id);
    await this.prisma.apiToken.update({
      where: { id },
      data: {
        activo: false,
        ultimaModificacion: new Date(),
      },
    });
  }

  private toResponseDto(token: any): ApiTokenResponseDto {
    const raw = {
      id: token.id,
      servicio: token.integrationService.nombre,
      descripcion: token.descripcion,
      estado: token.estado,
      ultimaModificacion: token.ultimaModificacion,
      fechaConfiguracion: token.fechaConfiguracion,
      ultimaVerificacion: token.ultimaVerificacion,
      apiKey: token.apiKey,
      serverUrl: token.serverUrl,
    };
    return plainToInstance(ApiTokenResponseDto, raw, {
      excludeExtraneousValues: true,
    });
  }

}
