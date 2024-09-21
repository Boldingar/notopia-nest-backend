import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity'; // Assuming delivery-man is a user

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  phoneNumber: number;

  
  @Column(() => Order )
  currentOrder: Order;

  @CreateDateColumn()
  dateOfAssignment: Date; // Date when the delivery task was assigned

  @Column({ type: 'timestamp', nullable: true })
  dateOfDelivered: Date; // Date when the delivery was completed
}
