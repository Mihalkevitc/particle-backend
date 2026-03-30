import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // Запускает Passport стратегию 'jwt'
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Не авторизован. Пожалуйста, предоставьте JWT токен.'); // Если ошибка - отклоняем
    }
    return user; // 3. Если всё ок - user попадает в request.user
  }
}
