import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-token') {
  private googleClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super();
    this.googleClient = new OAuth2Client(
      configService.get('google.clientId'),
    );
  }

  async validate(req: Request): Promise<any> {
    const { idToken } = req.body;
    if (!idToken) throw new UnauthorizedException('Google ID token required');

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get('google.clientId'),
      });
      const payload = ticket.getPayload();
      if (!payload?.email) throw new UnauthorizedException('Invalid Google token');

      let user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        user = await this.usersService.createFromGoogle({
          email: payload.email,
          fullName: payload.name || payload.email,
          googleId: payload.sub,
          avatarUrl: payload.picture,
        });
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Google token verification failed');
    }
  }
}
