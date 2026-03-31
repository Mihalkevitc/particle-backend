import { ApiProperty } from '@nestjs/swagger';

// DTO для регистрации нового пользователя
export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Пароль (будет захэширован)' })
  password: string;
}