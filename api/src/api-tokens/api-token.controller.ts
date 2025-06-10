import { Controller, Get, Post, Param, Patch, Body, ParseUUIDPipe, UseGuards, DefaultValuePipe, ParseIntPipe, Query, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ApiTokenService } from './api-token.service';
import { CreateApiTokenDto } from './dtos/create-api-token.dto';
import { UpdateApiTokenDto } from './dtos/update-api-token.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTokenResponseDto } from './dtos/api-token-response.dto';
import { plainToInstance } from 'class-transformer';

@UseGuards(AuthGuard)
@Controller('api-tokens')
export class ApiTokenController {
  constructor(private readonly service: ApiTokenService) {}

  @Get()
  async getApiTokens(): Promise<ApiTokenResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ApiTokenResponseDto> {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createToken(
    @Body() dto: CreateApiTokenDto,
  ): Promise<ApiTokenResponseDto> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateApiTokenDto,
  ): Promise<ApiTokenResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<null> {
    await this.service.deactivate(id);
    return null;
  }

}
