import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PresetsService } from './presets.service';
import { PresetResponseDto } from './dto/preset-response.dto';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('presets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все пресеты текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список пресетов успешно получен', type: [PresetResponseDto] })
  async findAll(@GetUser() user: User): Promise<PresetResponseDto[]> {
    return this.presetsService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пресет по ID' })
  @ApiParam({ name: 'id', description: 'Идентификатор пресета', example: 1 })
  @ApiResponse({ status: 200, description: 'Пресет найден', type: PresetResponseDto })
  @ApiResponse({ status: 404, description: 'Пресет не найден' })
  async findOne(@Param('id') id: string, @GetUser() user: User): Promise<PresetResponseDto> {
    return this.presetsService.findOneAndCheckOwner(+id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый пресет' })
  @ApiResponse({ status: 201, description: 'Пресет успешно создан', type: PresetResponseDto })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(@Body() createPresetDto: CreatePresetDto, @GetUser() user: User): Promise<PresetResponseDto> {
    return this.presetsService.create(createPresetDto, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить существующий пресет' })
  @ApiParam({ name: 'id', description: 'Идентификатор пресета', example: 1 })
  @ApiResponse({ status: 200, description: 'Пресет обновлён', type: PresetResponseDto })
  @ApiResponse({ status: 404, description: 'Пресет не найден' })
  @ApiResponse({ status: 403, description: 'Нет доступа к этому пресету' })
  async update(
    @Param('id') id: string,
    @Body() updatePresetDto: UpdatePresetDto,
    @GetUser() user: User,
  ): Promise<PresetResponseDto> {
    return this.presetsService.update(+id, updatePresetDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пресет' })
  @ApiParam({ name: 'id', description: 'Идентификатор пресета', example: 1 })
  @ApiResponse({ status: 204, description: 'Пресет успешно удалён' })
  @ApiResponse({ status: 404, description: 'Пресет не найден' })
  @ApiResponse({ status: 403, description: 'Нет доступа к этому пресету' })
  async remove(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.presetsService.remove(+id, user.id);
  }
}