import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Описываем структуру таблицы 'presets' в базе данных
@Entity({ name: 'presets' })
export class Preset {
  // Автоинкрементный первичный ключ
  @PrimaryGeneratedColumn()
  id: number;

  // Название пресета, обязательное поле, максимум 255 символов
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  // JSON-конфигурация визуализации. Храним в формате jsonb (бинарный, с индексами)
  // Это позволяет эффективно искать внутри конфигурации
  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  // Идентификатор пользователя, которому принадлежит пресет
  // Пока без внешнего ключа, добавим позже с модулем Auth
  @Column({ type: 'int', name: 'user_id', nullable: true })
  userId: number;

  // Публичный ли пресет (виден всем в ленте)
  @Column({ type: 'boolean', name: 'is_public', default: false })
  isPublic: boolean;

  // Дата создания, заполняется автоматически
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Дата последнего обновления, обновляется автоматически
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}