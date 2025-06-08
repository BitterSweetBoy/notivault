import { Injectable, signal } from '@angular/core';
import { ApiToken } from '../../../shared/models/api-token.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  constructor() {}

  tokens: ApiToken[] = [
    {
      id: 1,
      servicio: 'Plane.so',
      descripcion: 'API Key configurada',
      estado: 'conectado',
      ultimaModificacion: new Date('2025-06-06T14:30:00'),
      fechaConfiguracion: new Date('2025-06-06T14:30:00'),
      ultimaVerificacion: new Date('2025-06-06T15:45:00'),
      apiKey: 'pLsk_a1b2c3d4e5f6g7h8i9j0',
    },
    {
      id: 2,
      servicio: 'Mattermost',
      descripcion: 'API Key y URL configuradas',
      estado: 'conectado',
      ultimaModificacion: new Date('2025-06-05T09:15:00'),
      fechaConfiguracion: new Date('2025-06-05T09:15:00'),
      ultimaVerificacion: new Date('2025-06-05T10:30:00'),
      apiKey: 'mm_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      serverUrl: 'https://mattermost.tudominio.com',
    },
  ];

  getApiTokens() {
    return this.tokens;
  }

}
