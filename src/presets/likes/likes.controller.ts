import { Controller, Post, Delete, Param, HttpCode, HttpStatus, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preset } from '../preset.entity';

@ApiTags('likes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('presets/:presetId/like')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
    @InjectRepository(Preset)
    private readonly presetRepository: Repository<Preset>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Поставить лайк пресету' })
  @ApiParam({ name: 'presetId', description: 'ID пресета', example: 1 })
  @ApiResponse({ status: 201, description: 'Лайк поставлен' })
  @ApiResponse({ status: 404, description: 'Пресет не найден' })
  @ApiResponse({ status: 409, description: 'Лайк уже поставлен' })
  async like(
    @Param('presetId') presetId: string,
    @GetUser() user: User,
  ): Promise<void> {
    // Проверяем, существует ли пресет
    const preset = await this.presetRepository.findOne({ where: { id: +presetId } });
    if (!preset) {
      throw new NotFoundException(`Preset with id ${presetId} not found`);
    }
    return this.likesService.like(+presetId, user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Убрать лайк с пресета' })
  @ApiParam({ name: 'presetId', description: 'ID пресета', example: 1 })
  @ApiResponse({ status: 204, description: 'Лайк убран' })
  @ApiResponse({ status: 404, description: 'Лайк не найден' })
  async unlike(
    @Param('presetId') presetId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.likesService.unlike(+presetId, user.id);
  }
}