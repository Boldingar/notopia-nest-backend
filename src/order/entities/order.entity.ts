import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => CartItem, { eager: true })
  @JoinTable()
  products: CartItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 50 })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAtDate: Date;

  @Column({ nullable: true })
  deliveryId: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @ManyToOne(() => Delivery, (delivery) => delivery.currentOrders)
  delivery: Delivery;
}
