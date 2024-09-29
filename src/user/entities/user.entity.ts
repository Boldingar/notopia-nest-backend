import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  firstName: string;

  @Column({ length: 20 })
  lastName: string;

  @Column({ length: 15, unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ length: 10 })
  gender: string;

  @Column({
    type: 'enum',
    enum: ['customer', 'admin', 'delivery-man'],
    nullable: true,
    default: 'customer',
  })
  flag: 'customer' | 'admin' | 'delivery-man';

  @OneToMany(() => CartItem, (cartItem) => cartItem.user, { cascade: true })
  cart: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.User)
  addresses: Address[];

  @ManyToMany(() => Product)
  @JoinTable()
  wishlist: Product[];

  @ManyToMany(() => Voucher, { nullable: true })
  @JoinTable()
  vouchers: Voucher[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
