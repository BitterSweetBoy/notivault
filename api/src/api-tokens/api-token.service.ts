import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApiTokenDto } from './dtos/create-api-token.dto';
import { UpdateApiTokenDto } from './dtos/update-api-token.dto';
import { ApiTokenResponseDto } from './dtos/api-token-response.dto';
import { plainToInstance } from 'class-transformer';
import { TokenStatusService } from './api-token-status.service';

@Injectable()
export class ApiTokenService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenStatusService: TokenStatusService
  ) {}

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

    const { nombre: serviceName } =
      await this.prisma.integrationService.findUniqueOrThrow({
        where: { id: dto.integrationServiceId },
        select: { nombre: true },
      });

    // Normalizar el serverUrl
    const serverUrl = this.normalizeServerUrl(serviceName, dto.serverUrl);

    const created = await this.prisma.apiToken.create({
      data: {
        ...dto,
        serverUrl,
        fechaConfiguracion: now,
        ultimaModificacion: now,
        ultimaVerificacion: now,
      },
      include: { integrationService: true },
    });

    // actualizar su estado
    await this.tokenStatusService.validateToken(
      created.id,
      created.integrationService.nombre,
      created.apiKey,
      created.serverUrl,
    );

    const reloaded = await this.prisma.apiToken.findUniqueOrThrow({
      where: { id: created.id },
      include: { integrationService: true },
    });

    return this.toResponseDto(reloaded);
  }

  /** Actualiza el token y devuelve el DTO */
  async update( id: string, dto: UpdateApiTokenDto): Promise<ApiTokenResponseDto> {
    const existing = await this.prisma.apiToken.findUniqueOrThrow({
      where: { id },
      include: { integrationService: true },
    });

    const serverUrl = this.normalizeServerUrl(
      existing.integrationService.nombre,
      dto.serverUrl,
    );

    const updated = await this.prisma.apiToken.update({
      where: { id },
      data: {
        ...dto,
        serverUrl,
        ultimaModificacion: new Date(),
      },
      include: { integrationService: true },
    });

    // Validar y refrescar estado
    await this.tokenStatusService.validateToken(
      updated.id,
      updated.integrationService.nombre,
      updated.apiKey,
      updated.serverUrl,
    );

    const reloaded = await this.prisma.apiToken.findUniqueOrThrow({
      where: { id },
      include: { integrationService: true },
    });

    return this.toResponseDto(reloaded);
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

  private normalizeServerUrl(
    serviceName: string,
    providedUrl?: string,
  ): string | undefined {
    const isEmpty = providedUrl === undefined || providedUrl.trim() === '';

    if (isEmpty) {
      return serviceName === 'Plane.so'
        ? 'https://api.plane.so'
        : undefined;
    }

    return providedUrl.trim();
  }

}
