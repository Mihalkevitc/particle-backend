import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Preset } from '../preset.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  // Внешний ключ на presets.id с CASCADE удалением
  // Если пресет удалён, все его комментарии удаляются
  @ManyToOne(() => Preset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'preset_id' })
  preset: Preset;

  @Column({ type: 'int', name: 'preset_id', nullable: false })
  presetId: number;

  // userId может быть NULL, если пользователь был удалён (ON DELETE SET NULL)
  @Column({ type: 'int', name: 'user_id', nullable: true })
  userId: number | null;

  @Column({ type: 'text', nullable: false })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
