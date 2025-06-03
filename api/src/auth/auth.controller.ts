import { Controller, Post, Body, Res, Req, UseGuards, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { SESSION_TTL } from './constants';
import { getRequestIP } from '../common/utils/request-ip.util';
import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private session: SessionService) {}

  @Post('register')
  @Public()
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = getRequestIP(req);

    const { sessionKey } = await this.auth.login(
      dto.email,
      dto.password,
      userAgent,
      ipAddress,
    );

    res.cookie('SESSION_ID', sessionKey, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: SESSION_TTL,
      secure: true,
      signed: true,
    });

    return { message: 'Inicio de sesión exitoso' };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionKey = req.signedCookies?.SESSION_ID;
    if (!sessionKey) throw new UnauthorizedException('Sesión no encontrada o inválida');

    await this.auth.logout(sessionKey);
    res.clearCookie('SESSION_ID');
    
  }

  @Get('validate')
  @UseGuards(AuthGuard)
  validateSession(@Req() req: any) {
    return "Sesión válida";
  }

}
