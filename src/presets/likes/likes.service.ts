import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  // Проверить, поставил ли пользователь лайк пресету
  async hasLiked(presetId: number, userId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { presetId, userId },
    });
    return !!like;
  }

  // Получить количество лайков у пресета
  async getLikesCount(presetId: number): Promise<number> {
    return this.likeRepository.count({ where: { presetId } });
  }

  // Получить все лайки пользователя
  async findByUserId(userId: number): Promise<Like[]> {
    return this.likeRepository.find({ where: { userId } });
  }

  // Поставить лайк
  async like(presetId: number, userId: number): Promise<void> {
    const existing = await this.likeRepository.findOne({
      where: { presetId, userId },
    });
    if (existing) {
      throw new ConflictException('You have already liked this preset');
    }

    const like = this.likeRepository.create({ presetId, userId });
    await this.likeRepository.save(like);
  }

  // Убрать лайк
  async unlike(presetId: number, userId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { presetId, userId },
    });
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    await this.likeRepository.remove(like);
  }
}
