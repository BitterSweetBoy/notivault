export interface ApiToken {
  id: number;
  servicio: 'Plane.so' | 'Mattermost';
  descripcion: string;
  estado: 'conectado' | 'desconectado';
  ultimaModificacion: Date;
  fechaConfiguracion: Date;
  ultimaVerificacion: Date;
  apiKey: string;
  serverUrl?: string; 
}

export interface ExpandedRowsState {
  [key: string]: boolean;
}

export interface EditingState {
  [key: string]: boolean;
}

export interface OriginalValues {
  [key: string]: ApiToken;
}