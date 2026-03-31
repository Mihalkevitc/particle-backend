import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Unique } from 'typeorm';

// Один пользователь может поставить лайк только одному пресету один раз
@Unique(['presetId', 'userId'])
@Entity({ name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'preset_id', nullable: false })
  presetId: number;

  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
