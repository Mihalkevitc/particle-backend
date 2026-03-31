import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommentsService, CreateCommentDto, UpdateCommentDto, CommentResponseDto } from './comments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

@ApiTags('comments')
@Controller('presets/:presetId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  // GET /presets/:presetId/comments - получить комментарии к пресету
  @Get()
  @ApiOperation({ summary: 'Получить комментарии к пресету' })
  @ApiParam({ name: 'presetId', description: 'ID пресета', example: 1 })
  @ApiResponse({ status: 200, description: 'Список комментариев', type: [CommentResponseDto] })
  async findByPresetId(@Param('presetId') presetId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentsService.findByPresetId(+presetId);
    const result: CommentResponseDto[] = [];

    for (const comment of comments) {
      const author = await this.usersService.findById(comment.userId);
      result.push({
        id: comment.id,
        text: comment.text,
        author: {
          id: author.id,
          email: author.email,
        },
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      });
    }
    return result;
  }

  // POST /presets/:presetId/comments - добавить комментарий
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить комментарий к пресету' })
  @ApiParam({ name: 'presetId', description: 'ID пресета', example: 1 })
  @ApiBody({ schema: { example: { text: 'Красивая визуализация!' } } })
  @ApiResponse({ status: 201, description: 'Комментарий добавлен', type: CommentResponseDto })
  async create(
    @Param('presetId') presetId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentResponseDto> {
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

  // PUT /comments/:id - обновить комментарий
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
    const author = await this.usersService.findById(comment.userId);
    return {
      id: comment.id,
      text: comment.text,
      author: {
        id: author.id,
        email: author.email,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  // DELETE /comments/:id - удалить комментарий
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
