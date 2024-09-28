import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.vouchers, { nullable: true })
  users: User[];

  @Column({ type: 'decimal', nullable: true })
  discountPercentage?: number;

  @Column({ type: 'decimal', nullable: true })
  discountValue?: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;
}
