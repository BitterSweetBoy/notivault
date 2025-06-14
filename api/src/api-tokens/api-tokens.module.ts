import { Module } from '@nestjs/common';
import { ApiTokenService } from './api-token.service';
import { ApiTokenController } from './api-token.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenStatusService } from './api-token-status.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [AuthModule, PrismaModule, HttpModule, ConfigModule], 
    controllers: [ApiTokenController],
    providers: [ApiTokenService, TokenStatusService],
})
export class ApiTokensModule {}
