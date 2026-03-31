import { ApiProperty } from '@nestjs/swagger';

export class CreatePresetDto {
  @ApiProperty({ example: 'Космический поток', description: 'Название пресета' })
  name: string;

  @ApiProperty({ example: { particleCount: 5000, colors: ['#1a1a2e'] }, description: 'Конфигурация визуализации', required: false })
  config?: Record<string, any>;

  @ApiProperty({ example: false, description: 'Публичный ли пресет', required: false, default: false })
  isPublic?: boolean;
}
