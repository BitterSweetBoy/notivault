import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoginAttemptService {
  constructor(private prisma: PrismaService) {}

  async logAttempt(email: string, ipAddress: string, userAgent: string, success: boolean) {
    await this.prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        success,
      },
    });
  }

  async getRecentFailedAttempts(email: string, limitMs: number): Promise<number> {
    const since = new Date(Date.now() - limitMs);
    return this.prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        timestamp: { gte: since },
      },
    });
  }
}
