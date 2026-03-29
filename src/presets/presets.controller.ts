import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PresetsService } from './presets.service';
import { Preset } from './preset.entity';

@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  // GET /presets — получить все пресеты
  @Get()
  async findAll(): Promise<Preset[]> {
    return this.presetsService.findAll();
  }

  // GET /presets/:id — получить один пресет по ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Preset> {
    // Преобразуем строку в число, так как Param всегда возвращает строку
    return this.presetsService.findOne(+id);
  }

  // POST /presets — создать новый пресет
  // Тело запроса должно содержать поля name, config (опционально), userId (опционально)
  @Post()
  async create(@Body() createPresetDto: Partial<Preset>): Promise<Preset> {
    return this.presetsService.create(createPresetDto);
  }

  // PUT /presets/:id — полностью обновить пресет
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Preset>,
  ): Promise<Preset> {
    return this.presetsService.update(+id, updateData);
  }

  // DELETE /presets/:id — удалить пресет
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Возвращаем 204 No Content при успехе
  async remove(@Param('id') id: string): Promise<void> {
    return this.presetsService.remove(+id);
  }
}