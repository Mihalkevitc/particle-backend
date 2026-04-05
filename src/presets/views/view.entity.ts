import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'views' })
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'preset_id', nullable: false })
  presetId: number;

  @Column({ type: 'int', name: 'user_id', nullable: true }) // null - неваторизован 
  userId: number | null;

  // ip-адрес для однозначной идентификации неавтор. пользователей
  @Column({ type: 'varchar', length: 45, name: 'ip_address', nullable: true }) 
  ipAddress: string | null;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;
}