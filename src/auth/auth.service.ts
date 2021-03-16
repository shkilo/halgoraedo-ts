import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.model';
import { UserService } from '../user/user.service';
import { JwtUserPayload } from './interfaces/jwt-user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateGoogleUser(profile: Profile): Promise<User> {
    const createUserDto: CreateUserDto = {
      email: profile.emails[0].value,
      provider: profile.provider,
      name: profile.name.givenName,
    };

    const user = await this.userService.findOrCreate(createUserDto);
    return user;
  }

  getJwtToken(user: User) {
    const payload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      provider: user.provider,
    };

    return this.jwtService.sign(payload);
  }
}
