import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Session, User } from '@prisma/client';
import { randomBytes } from 'crypto';

const SESSION_TTL = 1000 * 60 * 60; // 1 hora

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, userAgent: string, ipAddress: string) {
    const sessionKey = randomBytes(32).toString('hex');
    const ticketData = JSON.stringify({ userId });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60);

    const session = await this.prisma.session.create({
      data: {
        userId,
        sessionKey,
        ticketData,
        createdAt: now,
        lastActivity: now,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });
    return session;
  }

  async validateSession(sessionKey: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { sessionKey },
    });

    if (
      !session ||
      session.isSessionExpired ||
      session.revokedByAdmin ||
      session.logoutAt ||
      new Date(session.expiresAt) < new Date()
    ) {
      return null;
    }

    return session;
  }

  async updateActivity(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() },
    });
  }

  async getSession(
    sessionId: string,
  ): Promise<(Session & { user: User }) | null> {
    return this.prisma.session.findFirst({
      where: { id: sessionId, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
  }

  async expireSession(sessionKey: string): Promise<void> {
    await this.prisma.session.update({
      where: { sessionKey },
      data: {
        isSessionExpired: true,
        logoutAt: new Date(),
      },
    });
  }

  async maybeRenewSession(sessionKey: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { sessionKey },
    });
    if (!session) return false;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const diffMs = expiresAt.getTime() - now.getTime();

    // Si faltan menos de 10 minutos
    if (diffMs <= 1000 * 60 * 10 && diffMs > 0) {
      const newExpiresAt = new Date(now.getTime() + 1000 * 60 * 60);
      await this.prisma.session.update({
        where: { sessionKey },
        data: {
          expiresAt: newExpiresAt,
          lastActivity: now,
        },
      });
      return true;
    }

    // Si aún falta más de 10 minutos, solo actualiza la actividad
    if (diffMs > 0) {
      await this.updateActivity(session.id);
      return false;
    }

    // Ya expiró
    return false;
  }
}
