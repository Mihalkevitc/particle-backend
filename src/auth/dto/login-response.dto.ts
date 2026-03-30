import { UserResponseDto } from '../../users/dto/user-response.dto';

// DTO для ответа после успешного логина
export class LoginResponseDto {
  accessToken: string;   // JWT токен
  user: UserResponseDto; // Данные пользователя
}
