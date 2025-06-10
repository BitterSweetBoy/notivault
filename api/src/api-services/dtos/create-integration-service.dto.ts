import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIntegrationServiceDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  icono?: string;
}
