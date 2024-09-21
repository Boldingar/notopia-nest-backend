import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'decimal', nullable: true })
  discountPercentage?: number;

  @Column({ type: 'decimal', nullable: true })
  discountValue?: number;

  @CreateDateColumn({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp'})
  endDate: Date;
}
