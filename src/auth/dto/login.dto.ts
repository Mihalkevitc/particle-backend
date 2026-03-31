import { ApiProperty } from '@nestjs/swagger';

// DTO для логина
export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Пароль' })
  password: string;
}
