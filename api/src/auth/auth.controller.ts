import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: { name: string; email: string; password: string }) {
    return this.auth.register(dto.name, dto.email, dto.password);
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip;

    const { user, sessionKey } = await this.auth.login(
      dto.email,
      dto.password,
      userAgent,
      ipAddress || '',
    );

    res.cookie('SESSION_ID', sessionKey, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
      secure: true,
    });

    return user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionKey = req.cookies['SESSION_ID'];
    await this.auth.logout(sessionKey);
    res.clearCookie('SESSION_ID');
  }
}
