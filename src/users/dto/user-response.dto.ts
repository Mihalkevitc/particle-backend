// DTO для ответа при регистрации и получении профиля
// Не возвращаем password_hash!
export class UserResponseDto {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
