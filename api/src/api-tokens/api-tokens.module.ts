import { Module } from '@nestjs/common';
import { ApiTokenService } from './api-token.service';
import { ApiTokenController } from './api-token.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [AuthModule, PrismaModule], 
    controllers: [ApiTokenController],
    providers: [ApiTokenService],
})
export class ApiTokensModule {}
