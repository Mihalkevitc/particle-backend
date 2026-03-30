// DTO для регистрации нового пользователя
export class CreateUserDto {
  email: string;      // email пользователя
  password: string;   // пароль (будет захэширован)
}
