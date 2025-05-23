import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SessionService } from './session.service';
import { User } from '@prisma/client';

const SESSION_TTL = 1000 * 60 * 60 * 12; // 1 día

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private sessions: SessionService,
  ) {}

  async register(name: string, email: string, password: string): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({ data: { name, email, password: hash } });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const session = await this.sessions.createSession(user.id, SESSION_TTL);
    return { user, sessionId: session.id };
  }

  async logout(sessionId: string) {
    await this.sessions.deleteSession(sessionId);
  }
}
