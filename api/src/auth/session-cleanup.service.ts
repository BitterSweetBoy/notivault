// src/auth/session-cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(private prisma: PrismaService) {}

    /**
     * This method is scheduled to run every 10 minutes and marks expired sessions as expired.
     * It checks for sessions that have an expiration date in the past and updates their status.
     */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleExpiredSessions() {
    const now = new Date();
    const result = await this.prisma.session.updateMany({
      where: {
        expiresAt: { lt: now },
        isSessionExpired: false,
        logoutAt: null,
        revokedByAdmin: false,
      },
      data: {
        isSessionExpired: true,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Marcadas ${result.count} sesiones como expiradas`);
    }
  }
}
