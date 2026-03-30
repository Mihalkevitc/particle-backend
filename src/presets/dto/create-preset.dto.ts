import { ApiProperty } from '@nestjs/swagger';

// DTO для создания пресета
export class CreatePresetDto {
  @ApiProperty({ description: 'Название пресета', example: 'Космический поток' })
  name: string;

  @ApiProperty({ description: 'JSON-конфигурация визуализации', required: false, example: { particleCount: 5000 } })
  config?: Record<string, any>;
}
