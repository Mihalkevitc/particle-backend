import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'super-secret-key-change-me',
    });
  }

  // Паспорт автоматически добавляет user в request после успешной валидации
  async validate(payload: { sub: number; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    // Удаляем password_hash, чтобы не передавать его в request
    const { passwordHash, ...result } = user;
    return result;
  }
}
