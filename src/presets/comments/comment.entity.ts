import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'preset_id', nullable: false })
  presetId: number;

  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  // Основная полезная нагрузка
  @Column({ type: 'text', nullable: false })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
