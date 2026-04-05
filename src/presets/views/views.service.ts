import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { View } from './view.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
  ) {}

  // Записать просмотр пресета с защитой от накрутки
  async recordView(presetId: number, userId?: number, ipAddress?: string): Promise<void> {
    // Идентификатор для неавторизованных - IP-адрес
    const identifier = userId || ipAddress;
    
    if (!identifier) {
      // Если нет ни userId, ни IP - не записываем
      return;
    }
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    // 5      - количество минут
    // 60     - секунд в минуте
    // 1000   - миллисекунд в секунде

    // Итог: 5 * 60 * 1000 = 300 000 миллисекунд (5 минут)
    
    // Считаем просмотры от этого идентификатора за последние 5 минут
    let recentViews = 0;
    
    if (userId) {
      // Авторизованные: считаем по userId
      recentViews = await this.viewRepository.count({
        where: {
          presetId,
          userId,
          viewedAt: MoreThan(fiveMinutesAgo),
        },
      });
    } else if (ipAddress) {
      // Неавторизованные: считаем по IP
      recentViews = await this.viewRepository.count({
        where: {
          presetId,
          ipAddress,
          viewedAt: MoreThan(fiveMinutesAgo),
        },
      });
    }
    
    if (recentViews > 10) {
      console.warn(`[Security] Potential bot detected: presetId=${presetId}, userId=${userId}, ip=${ipAddress}, recentViews=${recentViews}`);
      return;
    }
    
    const view = this.viewRepository.create({
      presetId,
      userId: userId || null,
      ipAddress: ipAddress || null,
    });
    await this.viewRepository.save(view);
  }

  // Получить количество просмотров пресета
  async getViewsCount(presetId: number): Promise<number> {
    return this.viewRepository.count({ where: { presetId } });
  }

  // Получить уникальных зрителей (один раз за всё время)
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