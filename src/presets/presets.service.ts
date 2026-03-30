import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preset } from './preset.entity';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';
import { PresetResponseDto } from './dto/preset-response.dto';

@Injectable()
export class PresetsService {
  constructor(
    @InjectRepository(Preset)
    private readonly presetRepository: Repository<Preset>,
  ) {}

  // Преобразуем Preset в PresetResponseDto
  private toResponseDto(preset: Preset): PresetResponseDto {
    return {
      id: preset.id,
      name: preset.name,
      config: preset.config,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };
  }

  // Получить все пресеты пользователя
  async findAllByUser(userId: number): Promise<PresetResponseDto[]> {
    const presets = await this.presetRepository.find({ where: { userId } });
    return presets.map(p => this.toResponseDto(p));
  }

  // Найти один пресет по ID (без проверки владельца)
  async findOne(id: number): Promise<Preset> {
    const preset = await this.presetRepository.findOne({ where: { id } });
    if (!preset) {
      throw new NotFoundException(`Preset with id ${id} not found`);
    }
    return preset;
  }

  // Найти пресет и проверить, что он принадлежит пользователю
  async findOneAndCheckOwner(id: number, userId: number): Promise<PresetResponseDto> {
    const preset = await this.findOne(id);
    if (preset.userId !== userId) {
      throw new ForbiddenException('You do not have access to this preset');
    }
    return this.toResponseDto(preset);
  }

  // Создать новый пресет
  async create(createPresetDto: CreatePresetDto, userId: number): Promise<PresetResponseDto> {
    const preset = this.presetRepository.create({
      ...createPresetDto,
      userId, // Приявязка присета к пользователю
    });
    const savedPreset = await this.presetRepository.save(preset);
    return this.toResponseDto(savedPreset);
  }

  // Обновить существующий пресет
  async update(id: number, updatePresetDto: UpdatePresetDto, userId: number): Promise<PresetResponseDto> {
    // Сначала проверяем существование и права доступа
    await this.findOneAndCheckOwner(id, userId);
    // Обновляем
    await this.presetRepository.update(id, updatePresetDto);
    // Возвращаем обновлённую запись
    const updated = await this.findOne(id);
    return this.toResponseDto(updated);
  }

  // Удалить пресет
  async remove(id: number, userId: number): Promise<void> {
    // Сначала проверяем существование и права доступа
    await this.findOneAndCheckOwner(id, userId);
    const result = await this.presetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Preset with id ${id} not found`);
    }
  }
}
