import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Session, User } from '@prisma/client';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, ttlMs: number): Promise<Session> {
    return this.prisma.session.create({
      data: {
        id: uuid(),
        userId,
        expiresAt: new Date(Date.now() + ttlMs),
      },
    });
  }

async getSession(sessionId: string): Promise<(Session & { user: User }) | null> {
    return this.prisma.session.findFirst({
      where: { id: sessionId, expiresAt: { gt: new Date() } },
      include: { user: true },  
    });
  }

  async deleteSession(sessionId: string) {
    return this.prisma.session.delete({ where: { id: sessionId } });
  }
}
