import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { Preset } from '../preset.entity';

// Один пользователь может поставить лайк только одному пресету один раз
@Unique(['presetId', 'userId'])
@Entity({ name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  // Внешний ключ на presets.id с CASCADE удалением
  // Если пресет удалён, все его лайки удаляются
  @ManyToOne(() => Preset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'preset_id' })
  preset: Preset;

  @Column({ type: 'int', name: 'preset_id', nullable: false })
  presetId: number;

  // userId может быть NULL, если пользователь был удалён (ON DELETE SET NULL)
  @Column({ type: 'int', name: 'user_id', nullable: true })
  userId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
