import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preset } from './preset.entity';

@Injectable()
export class PresetsService {
  constructor(
    // Внедряем репозиторий TypeORM для работы с таблицей presets
    @InjectRepository(Preset)
    private readonly presetRepository: Repository<Preset>,
  ) {}

  // CRUD:
  // Получить все пресеты (пока без фильтрации по пользователю)
  async findAll(): Promise<Preset[]> {
    return this.presetRepository.find();
  }

  // Найти один пресет по ID. Если не найден — выбросить 404
  async findOne(id: number): Promise<Preset> {
    const preset = await this.presetRepository.findOne({ where: { id } });
    if (!preset) {
      throw new NotFoundException(`Preset with id ${id} not found`);
    }
    return preset;
  }

  // Создать новый пресет
  async create(data: Partial<Preset>): Promise<Preset> {
    // Создаём экземпляр сущности из переданных данных
    const preset = this.presetRepository.create(data);
    // Сохраняем в базу данных
    return this.presetRepository.save(preset);
  }

  // Обновить существующий пресет
  async update(id: number, data: Partial<Preset>): Promise<Preset> {
    // Сначала проверяем, существует ли запись
    await this.findOne(id);
    // Обновляем
    await this.presetRepository.update(id, data);
    // Возвращаем обновлённую запись
    return this.findOne(id);
  }

  // Удалить пресет
  async remove(id: number): Promise<void> {
    const result = await this.presetRepository.delete(id);
    // Если ничего не удалено — запись не существовала
    if (result.affected === 0) {
      throw new NotFoundException(`Preset with id ${id} not found`);
    }
  }
}