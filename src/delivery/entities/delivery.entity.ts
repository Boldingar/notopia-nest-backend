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

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['delivery', 'stock'],
    nullable: true,
    default: 'delivery',
  })
  flag: 'delivery' | 'stock';

  @Column({ unique: true })
  phone: string;

  @OneToMany(() => Order, (order) => order.delivery, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  currentOrders?: Order[];

  @Column({ type: 'timestamp', nullable: true })
  dateOfAssignment?: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
