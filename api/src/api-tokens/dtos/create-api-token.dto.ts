import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateApiTokenDto {
  @IsUUID() @IsNotEmpty()
  integrationServiceId: string;

  @IsString() @IsNotEmpty()
  descripcion: string;

  @IsString() @IsNotEmpty()
  estado: 'conectado' | 'desconectado';

  @IsString() @IsNotEmpty()
  apiKey: string;

  @IsOptional() @IsString()
  serverUrl?: string;
}


