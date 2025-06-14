import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { TokenEstado } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenStatusService  {
  private readonly logger = new Logger(TokenStatusService.name);
  private readonly planeApiBaseUrl: string | undefined;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
   ) {
        this.planeApiBaseUrl = this.configService.get<string>('PLANE_API_BASE_URL');
    }
  
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron(){
    this.logger.debug('Iniciando chequeo de estado de tokens');
    const tokens = await this.prisma.apiToken.findMany({
      where: { activo: true },
      select: {
        id: true,
        apiKey: true,
        serverUrl: true,
        integrationService: {
          select: { nombre: true },
        },
      },
    });

    for (const token of tokens) {
      const serviceName = token.integrationService.nombre;
      await this.handleCheckToken(
        token.id,
        serviceName,
        token.apiKey,
        token.serverUrl,
      );
    }
  }

  private async handleCheckToken( id: string, serviceName: string, apiKey: string, serverUrl: string | null) {
    let reachable = false;
    const now = new Date();

    switch (serviceName) {
      case 'Plane.so':
        reachable = await this.checkPlaneSo(serverUrl, apiKey);
        break;
      case 'Mattermost':
        reachable = await this.checkMattermost(serverUrl, apiKey);
        break;
      default:
        this.logger.warn(`Servicio no soportado: ${serviceName}`);
        break;
    }

    await this.prisma.apiToken.update({
      where: { id },
      data: {
        estado: reachable ? TokenEstado.conectado : TokenEstado.desconectado,
        ultimaVerificacion: now,
      },
    });

    this.logger.log(
      `Token ${id} (${serviceName}): ${reachable ? 'conectado' : 'desconectado'}`,
    );
  }

  async validateToken( id: string, serviceName: string, apiKey: string, serverUrl: string | null): Promise<void> {
    await this.handleCheckToken(id, serviceName, apiKey, serverUrl);
  }

  private async checkPlaneSo( serverUrl, apiKey: string): Promise<boolean> {
    if (!this.planeApiBaseUrl) {
      this.logger.error('PLANE_API_BASE_URL no está configurada');
      return false;
    }
    try {
      const url = `${serverUrl}/api/v1/workspaces/workspace/projects`;
      const response$ = this.httpService.get(
        url,
        {
          headers: { 'X-API-Key': apiKey },
          timeout: 5000,
        },
      );
      const response = await firstValueFrom(response$);
      return response.status === 200;
    } catch (err) {
      this.logger.warn(`Plane.SO unreachable: ${err.message}`);
      return false;
    }
  }

  private async checkMattermost( serverUrl: string | null, apiKey: string): Promise<boolean> {
    if (!serverUrl) return false;
    try {
      const response$ = this.httpService.get(
        `${serverUrl}/api/v4/system/ping`,
        { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 5000 },
      );
      const response = await firstValueFrom(response$);
      return response.status === 200;
    } catch (err) {
      this.logger.warn(`Mattermost unreachable: ${err.message}`);
      return false;
    }
  }

}
