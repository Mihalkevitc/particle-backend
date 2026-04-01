import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { View } from './view.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
  ) {}

  // Записать просмотр пресета
  async recordView(presetId: number, userId?: number): Promise<void> {
    const view = this.viewRepository.create({
      presetId,
      userId: userId || null,
    });
    await this.viewRepository.save(view);
  }

  // Получить количество просмотров пресета
  async getViewsCount(presetId: number): Promise<number> {
    return this.viewRepository.count({ where: { presetId } });
  }

  // Получить уникальных зрителей (если нужно)
  async getUniqueViewersCount(presetId: number): Promise<number> {
    const result = await this.viewRepository
      .createQueryBuilder('view')
      .select('COUNT(DISTINCT view.userId)', 'count')
      .where('view.presetId = :presetId', { presetId })
      .andWhere('view.userId IS NOT NULL')
      .getRawOne();
    return parseInt(result?.count || '0');
  }
}
