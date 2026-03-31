import { ApiProperty } from '@nestjs/swagger';

export class PresetResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пресета' })
  id: number;

  @ApiProperty({ example: 'Космический поток', description: 'Название пресета' })
  name: string;

  @ApiProperty({ example: { particleCount: 5000, colors: ['#1a1a2e'] }, description: 'Конфигурация визуализации' })
  config: Record<string, any>;

  @ApiProperty({ example: true })
  isPublic: boolean;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z', description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z', description: 'Дата последнего обновления' })
  updatedAt: Date;
}