import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Декоратор для получения текущего пользователя из request
// Используется после JwtAuthGuard
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
