import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JWTAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JWTAuthGuard)
export class UserController {
  @Get('me')
  me(@Req() req: Request) {
    return { user: req.user };
  }
}
