import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'views' })
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'preset_id', nullable: false })
  presetId: number;

  @Column({ type: 'int', name: 'user_id', nullable: true }) // null = неавторизованный
  userId: number | null;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;
}
