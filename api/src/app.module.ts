import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiTokensModule } from './api-tokens/api-tokens.module';
import { IntegrationServiceModule } from './api-services/integration-service.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    ApiTokensModule,
    IntegrationServiceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
