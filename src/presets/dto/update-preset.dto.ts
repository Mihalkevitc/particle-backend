import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreatePresetDto } from './create-preset.dto';

// DTO для обновления пресета (все поля опциональны)
export class UpdatePresetDto extends PartialType(CreatePresetDto) {}
