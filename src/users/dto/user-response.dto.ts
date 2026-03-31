import { ApiProperty } from '@nestjs/swagger';


// DTO для ответа при регистрации и получении профиля
// Не возвращаем password_hash!
export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z', description: 'Дата регистрации' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z', description: 'Дата последнего обновления' })
  updatedAt: Date;
}