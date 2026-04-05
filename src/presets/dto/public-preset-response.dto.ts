import { ApiProperty } from '@nestjs/swagger';

class AuthorDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class PublicPresetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Космический поток' })
  name: string;

  @ApiProperty({ example: { particleCount: 5000, colors: ['#1a1a2e'] } })
  config: Record<string, any>;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty({ example: 42 })
  likesCount: number;

  @ApiProperty({ example: 7 })
  commentsCount: number;

  @ApiProperty({ example: 150 })
  viewsCount: number;

  @ApiProperty({ example: true })
  isLikedByCurrentUser: boolean;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z' })
  updatedAt: Date;
}
