import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  ) {
    const { user, sessionId } = await this.auth.login(dto.email, dto.password);
    res.cookie('SESSION_ID', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies['SESSION_ID'];
    await this.auth.logout(sessionId);
    res.clearCookie('SESSION_ID');
  }
}
