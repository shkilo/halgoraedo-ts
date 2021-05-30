import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { userAgentIPhone } from '../common/constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const clientIOSUrl = this.configService.get<string>('CLIENT_IOS_URL');
    const token = this.authService.getJwtToken(req.user);
    console.log(token);
    const userAgent = req.headers['user-agent'];

    res.status(200).redirect(`${clientUrl}?token=${token}`);
    // return userAgent.includes(userAgentIPhone)
    //   ? res.redirect(`${clientIOSUrl}?token=${token}`)
    //   : res.status(200).redirect(`${clientUrl}?token=${token}`);
  }
}
