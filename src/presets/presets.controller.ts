import { Controller, Get, Post, Body, Param, Put, Patch, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';
import { PresetsService } from './presets.service';
import { PresetResponseDto } from './dto/preset-response.dto';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';

// DTO для обновления публичности
class UpdatePublicStatusDto {
  @ApiProperty({ example: true, description: 'Публичный ли пресет' })
  isPublic: boolean;
}

@ApiTags('presets')
@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  // Публичный эндпоинт: получить ленту публичных пресетов (авторизация опциональна)
  @Get('public')
  @ApiOperation({ summary: 'Получить публичные пресеты (лента)' })
  @ApiResponse({ status: 200, description: 'Список публичных пресетов' })
  async getPublicFeed(@GetUser() user?: User) {
    return this.presetsService.findPublicPresets(user?.id);
  }

  // Защищённые эндпоинты (требуют авторизацию)
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все пресеты текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список пресетов', type: [PresetResponseDto] })
  async findAll(@GetUser() user: User): Promise<PresetResponseDto[]> {
    return this.presetsService.findAllByUser(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить пресет по ID' })
  @ApiParam({ name: 'id', description: 'Идентификатор пресета', example: 1 })
  @ApiResponse({ status: 200, description: 'Пресет найден', type: PresetResponseDto })
  @ApiResponse({ status: 404, description: 'Пресет не найден' })
  async findOne(@Param('id') id: string, @GetUser() user: User): Promise<PresetResponseDto> {
    return this.presetsService.findOneAndCheckOwner(+id, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый пресет' })
  @ApiResponse({ status: 201, description: 'Пресет создан', type: PresetResponseDto })
  async create(@Body() createPresetDto: CreatePresetDto, @GetUser() user: User): Promise<PresetResponseDto> {
    return this.presetsService.create(createPresetDto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить пресет' })
  @ApiParam({ name: 'id', description: 'Идентификатор пресета', example: 1 })
  @ApiResponse({ status: 200, description: 'Пресет обновлён', type: PresetResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updatePresetDto: UpdatePresetDto,
    @GetUser() user: User,
  ): Promise<PresetResponseDto> {
    return this.presetsService.update(+id, updatePresetDto, user.id);
  }

  @Patch(':id/public')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сделать пресет публичным или приватным' })
  @ApiParam({ name: 'id', description: 'Идентификатор пресета', example: 1 })
  @ApiBody({ type: UpdatePublicStatusDto, description: 'Тело запроса с полем isPublic' })
  @ApiResponse({ status: 200, description: 'Статус публичности обновлён', type: PresetResponseDto })
  async updatePublicStatus(
    @Param('id') id: string,
    @Body('isPublic') isPublic: boolean,
    @GetUser() user: User,
  ): Promise<PresetResponseDto> {
    return this.presetsService.updatePublicStatus(+id, user.id, isPublic);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пресет' })
  @ApiParam({ name: 'id', description: 'Идентификатор пресета', example: 1 })
  @ApiResponse({ status: 204, description: 'Пресет удалён' })
  async remove(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.presetsService.remove(+id, user.id);
  }
}