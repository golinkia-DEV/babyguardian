import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

/**
 * JWT guard con bypass opcional solo en desarrollo cuando AUTH_DEV_BYPASS=true.
 * Si el cliente envía Bearer válido, siempre se usa JWT. Sin header, impersona AUTH_DEV_BYPASS_USER_ID.
 */
@Injectable()
export class AppJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AppJwtAuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const bypass = this.configService.get<boolean>('auth.devBypass');
    const req = context.switchToHttp().getRequest();
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (bypass && !bearer) {
      const userId = this.configService.get<string>('auth.devBypassUserId')?.trim();
      if (!userId) {
        this.logger.error('AUTH_DEV_BYPASS activo pero falta AUTH_DEV_BYPASS_USER_ID');
        throw new UnauthorizedException('Configuración incorrecta del bypass de auth');
      }
      const user = await this.usersService.findById(userId);
      if (!user?.isActive) {
        throw new UnauthorizedException('Usuario de bypass no existe o está inactivo');
      }
      req.user = user;
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }
}
