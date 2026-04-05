import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preset } from './preset.entity';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';
import { PresetResponseDto } from './dto/preset-response.dto';
import { PublicPresetResponseDto } from './dto/public-preset-response.dto';
import { LikesService } from './likes/likes.service';
import { CommentsService } from './comments/comments.service';
import { UsersService } from '../users/users.service';
import { ViewsService } from './views/views.service';

@Injectable()
export class PresetsService {
  constructor(
    @InjectRepository(Preset)
    private readonly presetRepository: Repository<Preset>,
    private readonly likesService: LikesService,
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    private readonly viewsService: ViewsService,
  ) {}

  // Преобразование Preset в PresetResponseDto
  private toResponseDto(preset: Preset): PresetResponseDto {
    return {
      id: preset.id,
      name: preset.name,
      config: preset.config,
      isPublic: preset.isPublic,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };
  }

  // Получить все пресеты пользователя
  async findAllByUser(userId: number): Promise<PresetResponseDto[]> {
    const presets = await this.presetRepository.find({ where: { userId } });
    return presets.map(p => this.toResponseDto(p));
  }

  // Получить публичные пресеты (лента)
  async findPublicPresets(currentUserId?: number): Promise<PublicPresetResponseDto[]> {
    const presets = await this.presetRepository.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
    });

    const result: PublicPresetResponseDto[] = [];

    for (const preset of presets) {
      const author = await this.usersService.findById(preset.userId);
      const likesCount = await this.likesService.getLikesCount(preset.id);
      const commentsCount = await this.commentsService.getCommentsCount(preset.id);
      const viewsCount = await this.viewsService.getViewsCount(preset.id);
      const isLikedByCurrentUser = currentUserId
        ? await this.likesService.hasLiked(preset.id, currentUserId)
        : false;

      result.push({
        id: preset.id,
        name: preset.name,
        config: preset.config,
        author: {
          id: author.id,
          email: author.email,
        },
        likesCount,
        commentsCount,
        viewsCount,
        isLikedByCurrentUser,
        createdAt: preset.createdAt,
        updatedAt: preset.updatedAt,
      });
    }
    return result;
  }

  // Получить пресеты, которые лайкнул пользователь
  async findLikedByUser(userId: number): Promise<PublicPresetResponseDto[]> {
    // Находим все лайки пользователя
    const likes = await this.likesService.findByUserId(userId);
    const presetIds = likes.map(like => like.presetId);
    
    if (presetIds.length === 0) return [];
    
    // Находим пресеты по IDs
    const presets = await this.presetRepository.findByIds(presetIds);
    
    // Формируем ответ
    const result: PublicPresetResponseDto[] = [];
    for (const preset of presets) {
      const author = await this.usersService.findById(preset.userId);
      const likesCount = await this.likesService.getLikesCount(preset.id);
      const commentsCount = await this.commentsService.getCommentsCount(preset.id);
      const viewsCount = await this.viewsService.getViewsCount(preset.id);
      
      result.push({
        id: preset.id,
        name: preset.name,
        config: preset.config,
        author: { id: author.id, email: author.email },
        likesCount,
        commentsCount,
        viewsCount,
        isLikedByCurrentUser: true, // Здесь всегда true, так как это пресеты, которые пользователь лайкнул
        createdAt: preset.createdAt,
        updatedAt: preset.updatedAt,
      });
    }
    return result;
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
      userId,
      isPublic: createPresetDto.isPublic ?? false,
    });
    const savedPreset = await this.presetRepository.save(preset);
    return this.toResponseDto(savedPreset);
  }

  // Обновить существующий пресет
  async update(id: number, updatePresetDto: UpdatePresetDto, userId: number): Promise<PresetResponseDto> {
    await this.findOneAndCheckOwner(id, userId);
    await this.presetRepository.update(id, updatePresetDto);
    const updated = await this.findOne(id);
    return this.toResponseDto(updated);
  }

  // Обновить публичность пресета
  async updatePublicStatus(id: number, userId: number, isPublic: boolean): Promise<PresetResponseDto> {
    await this.findOneAndCheckOwner(id, userId);
    await this.presetRepository.update(id, { isPublic });
    const updated = await this.findOne(id);
    return this.toResponseDto(updated);
  }

  // Удалить пресет
  async remove(id: number, userId: number): Promise<void> {
    await this.findOneAndCheckOwner(id, userId);
    const result = await this.presetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Preset with id ${id} not found`);
    }
  }

  // Записать просмотр пресета (с поддержкой IP для неавторизованных)
  async recordView(id: number, userId?: number, ipAddress?: string): Promise<void> {
    await this.viewsService.recordView(id, userId, ipAddress);
  }

  // Получить пресет с просмотрами (для страницы пресета)
  async findOneWithViews(id: number, userId: number, currentUserId?: number): Promise<any> {
    const preset = await this.findOne(id);
    
    // Проверка прав (если пресет не публичный и не владелец)
    if (!preset.isPublic && preset.userId !== userId) {
      throw new ForbiddenException('You do not have access to this preset');
    }
    
    // Получаем статистику
    const viewsCount = await this.viewsService.getViewsCount(preset.id);
    const likesCount = await this.likesService.getLikesCount(preset.id);
    const commentsCount = await this.commentsService.getCommentsCount(preset.id);
    const isLikedByCurrentUser = currentUserId
      ? await this.likesService.hasLiked(preset.id, currentUserId)
      : false;
    
    const author = await this.usersService.findById(preset.userId);
    
    return {
      id: preset.id,
      name: preset.name,
      config: preset.config,
      isPublic: preset.isPublic,
      author: {
        id: author.id,
        email: author.email,
      },
      viewsCount,
      likesCount,
      commentsCount,
      isLikedByCurrentUser,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };
  }
}