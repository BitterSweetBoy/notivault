import { Expose } from "class-transformer";

export class ApiTokenResponseDto {
  @Expose() id: string;
  @Expose() servicio: string;
  @Expose() descripcion: string;
  @Expose() estado: string;
  @Expose() ultimaModificacion: Date;
  @Expose() fechaConfiguracion: Date;
  @Expose() ultimaVerificacion: Date;
  @Expose() apiKey: string;
  @Expose() serverUrl?: string;
}