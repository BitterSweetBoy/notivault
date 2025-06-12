export interface ApiToken {
  id: string;
  servicio: string;
  descripcion: string;
  estado: 'conectado' | 'desconectado';
  ultimaModificacion: Date;
  fechaConfiguracion: Date;
  ultimaVerificacion: Date;
  apiKey: string;
  serverUrl?: string;
}

export interface CreateApiTokenDto {
  integrationServiceId: string;
  descripcion: string;
  estado: 'conectado' | 'desconectado';
  apiKey: string;
  serverUrl?: string;
}

export interface UpdateApiTokenDto {
  integrationServiceId?: string;
  descripcion?: string;
  estado?: 'conectado' | 'desconectado';
  apiKey?: string;
  serverUrl?: string;
}

//Estados de UI de la tabla
export interface ExpandedRowsState { [key: string]: boolean; }
export interface EditingState      { [key: string]: boolean; }
export interface OriginalValues     { [key: string]: ApiToken; }
