import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from '../session.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request, Response } from 'express';
import { SESSION_TTL } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const sessionKey = req.signedCookies?.SESSION_ID;
    if (!sessionKey) throw new UnauthorizedException();

    const newKey = await this.sessionService.maybeRenewSession(sessionKey);
    if (newKey && newKey !== sessionKey) {
      res.cookie('SESSION_ID', newKey, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: SESSION_TTL,  
        secure: true,
        signed: true,
      });
    }

    const session = await this.sessionService.validateSession(sessionKey);
    if (!session) throw new UnauthorizedException();

    req.user = { id: session.userId, ...JSON.parse(session.ticketData) };
    req.prismaSession = session;

    return true;
  }
}
