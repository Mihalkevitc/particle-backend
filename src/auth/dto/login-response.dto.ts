import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

// DTO для ответа после успешного логина
export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...', description: 'JWT токен доступа' })
  accessToken: string;

  @ApiProperty({ type: UserResponseDto, description: 'Данные пользователя' })
  user: UserResponseDto;
}
