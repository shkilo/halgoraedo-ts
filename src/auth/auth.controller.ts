import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { getIntGenerator, intGenerator } from '../common/utils/int-generator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const token = this.authService.getJwtToken(req.user);

    const userAgent = req.headers['user-agent'];

    res.status(200).redirect(`${clientUrl}?token=${token}`);
  }

  // for load testing, not for production
  @Get('fakeLogin')
  async fakeLogin() {
    const fakeUserData: CreateUserDto = {
      email: `fakeAddress${intGenerator()}`,
      name: `fakeName${intGenerator()}`,
      provider: 'google',
    };
    const fakeUser = await this.userService.findOrCreate(fakeUserData);
    return { token: this.authService.getJwtToken(fakeUser) };
  }
}
