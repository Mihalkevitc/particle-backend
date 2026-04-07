import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Preset } from '../preset.entity';

@Entity({ name: 'views' })
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  // Внешний ключ на presets.id с CASCADE удалением
  // Если пресет удалён, все его просмотры удаляются
  @ManyToOne(() => Preset, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'preset_id' })
  preset: Preset;

  @Column({ type: 'int', name: 'preset_id', nullable: false })
  presetId: number;

  // userId может быть NULL, если пользователь был удалён (ON DELETE SET NULL)
  @Column({ type: 'int', name: 'user_id', nullable: true })
  userId: number | null;

  @Column({ type: 'varchar', length: 45, name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;
}
