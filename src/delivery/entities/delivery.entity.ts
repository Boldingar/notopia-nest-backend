import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity'; 

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @OneToOne(() => Order, { eager: true, nullable: true })
  @JoinColumn()
  currentOrder?: Order;

  @Column({ type: 'timestamp', nullable: true })
  dateOfAssignment?: Date; 

  @Column({ type: 'timestamp', nullable: true })
  dateOfDelivered?: Date; 
}
