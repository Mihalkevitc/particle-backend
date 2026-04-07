import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { ApiProperty } from '@nestjs/swagger';

// DTO для создания комментария
export class CreateCommentDto {
  @ApiProperty({ example: 'Красивая визуализация!', description: 'Текст комментария' })
  text: string;
}

// DTO для обновления комментария
export class UpdateCommentDto {
  @ApiProperty({ example: 'Обновлённый текст комментария', description: 'Новый текст комментария' })
  text: string;
}

class CommentAuthorDto {
  @ApiProperty({ example: 1, description: 'ID автора (null если пользователь удалён)', nullable: true })
  id: number | null;

  @ApiProperty({ example: 'user@example.com', description: 'Email автора (null если пользователь удалён)', nullable: true })
  email: string | null;
}

// DTO для ответа с комментарием
export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Красивая визуализация!' })
  text: string;

  @ApiProperty({ type: CommentAuthorDto, description: 'Автор комментария (null если пользователь удалён)' })
  author: CommentAuthorDto;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-05T12:00:00.000Z' })
  updatedAt: Date;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // Получить все комментарии к пресету
  async findByPresetId(presetId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { presetId },
      order: { createdAt: 'ASC' },
    });
  }

  // Получить количество комментариев у пресета
  async getCommentsCount(presetId: number): Promise<number> {
    return this.commentRepository.count({ where: { presetId } });
  }

  // Создать комментарий
  async create(presetId: number, userId: number, text: string): Promise<Comment> {
    const comment = this.commentRepository.create({
      presetId,
      userId,
      text,
    });
    return this.commentRepository.save(comment);
  }

  // Найти комментарий по ID (с проверкой владельца)
  async findOneAndCheckOwner(id: number, userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    // Если userId в комментарии стал NULL (пользователь удалён), никто не может его редактировать
    if (comment.userId !== null && comment.userId !== userId) {
      throw new ForbiddenException('You do not have access to this comment');
    }
    if (comment.userId === null) {
      throw new ForbiddenException('Cannot edit comment from deleted user');
    }
    return comment;
  }

  // Обновить комментарий
  async update(id: number, userId: number, text: string): Promise<Comment> {
    const comment = await this.findOneAndCheckOwner(id, userId);
    comment.text = text;
    return this.commentRepository.save(comment);
  }

  // Удалить комментарий
  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findOneAndCheckOwner(id, userId);
    await this.commentRepository.remove(comment);
  }
}
