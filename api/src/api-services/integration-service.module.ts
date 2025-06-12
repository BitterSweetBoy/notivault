import { Module } from '@nestjs/common';
import { IntegrationServiceController } from './integration-service.controller';
import { IntegrationServiceService } from './integration-service.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],  
  controllers: [IntegrationServiceController],
  providers: [IntegrationServiceService, PrismaService],
})
export class IntegrationServiceModule {}
