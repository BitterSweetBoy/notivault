import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from '../session.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

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

    const request = context.switchToHttp().getRequest();
    const sessionKey = request.cookies?.SESSION_ID;
    if (!sessionKey) return false;

    const session = await this.sessionService.validateSession(sessionKey);
    if (!session) throw new UnauthorizedException;

    // Sliding expiration: renueva si faltan menos de 10 minutos
    await this.sessionService.maybeRenewSession(sessionKey);

    request.user = { id: session.userId, ...JSON.parse(session.ticketData) };
    request.session = session;

    return true;
  }
}
