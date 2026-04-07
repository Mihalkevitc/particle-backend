import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommentsService, CreateCommentDto, UpdateCommentDto, CommentResponseDto } from './comments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preset } from '../preset.entity';

@ApiTags('comments')
@Controller('presets/:presetId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    @InjectRepository(Preset)
    private readonly presetRepository: Repository<Preset>,
  ) {}

  // GET /presets/:presetId/comments — получить комментарии к пресету
  @Get()
  @ApiOperation({ summary: 'Получить комментарии к пресету' })
  @ApiParam({ name: 'presetId', description: 'ID пресета', example: 1 })
  @ApiResponse({ status: 200, description: 'Список комментариев', type: [CommentResponseDto] })
  async findByPresetId(@Param('presetId') presetId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentsService.findByPresetId(+presetId);
    const result: CommentResponseDto[] = [];

    for (const comment of comments) {
      let author: { id: number | null; email: string | null };
      if (comment.userId !== null) {
        const user = await this.usersService.findById(comment.userId);
        author = { id: user.id, email: user.email };
      } else {
        author = { id: null, email: null };
      }
      result.push({
        id: comment.id,
        text: comment.text,
        author,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      });
    }
    return result;
  }

  // POST /presets/:presetId/comments — добавить комментарий
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить комментарий к пресету' })
  @ApiParam({ name: 'presetId', description: 'ID пресета', example: 1 })
  @ApiBody({ schema: { example: { text: 'Красивая визуализация!' } } })
  @ApiResponse({ status: 201, description: 'Комментарий добавлен', type: CommentResponseDto })
  @ApiResponse({ status: 404, description: 'Пресет не найден' })
  async create(
    @Param('presetId') presetId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentResponseDto> {
    // Проверяем, существует ли пресет
    const preset = await this.presetRepository.findOne({ where: { id: +presetId } });
    if (!preset) {
      throw new NotFoundException(`Preset with id ${presetId} not found`);
    }
    const comment = await this.commentsService.create(+presetId, user.id, createCommentDto.text);
    return {
      id: comment.id,
      text: comment.text,
      author: {
        id: user.id,
        email: user.email,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}

// Отдельный контроллер для операций с комментарием по ID
@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentByIdController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  // PUT /comments/:id — обновить комментарий
  @Put(':id')
  @ApiOperation({ summary: 'Обновить свой комментарий' })
  @ApiParam({ name: 'id', description: 'ID комментария', example: 1 })
  @ApiBody({ schema: { example: { text: 'Обновлённый текст комментария' } } })
  @ApiResponse({ status: 200, description: 'Комментарий обновлён', type: CommentResponseDto })
  @ApiResponse({ status: 403, description: 'Нет доступа к этому комментарию' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsService.update(+id, user.id, updateCommentDto.text);
    let author: { id: number | null; email: string | null };
    if (comment.userId !== null) {
      const authorUser = await this.usersService.findById(comment.userId);
      author = { id: authorUser.id, email: authorUser.email };
    } else {
      author = { id: null, email: null };
    }
    return {
      id: comment.id,
      text: comment.text,
      author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  // DELETE /comments/:id — удалить комментарий
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить свой комментарий' })
  @ApiParam({ name: 'id', description: 'ID комментария', example: 1 })
  @ApiResponse({ status: 204, description: 'Комментарий удалён' })
  @ApiResponse({ status: 403, description: 'Нет доступа к этому комментарию' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async remove(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.commentsService.remove(+id, user.id);
  }
}
