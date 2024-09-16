import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ length: 15 })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ length: 10 })
  gender: string;

  @ManyToMany(() => Product)
  @JoinTable()
  cart: Product[]; // Establish the many-to-many relationship with Product for cart

  @ManyToMany(() => Product)
  @JoinTable()
  wishlist: Product[]; // Establish the many-to-many relationship with Product for wishlist

  @OneToMany(() => Address, address => address.User)
  addresses: Address[]; // Establish the relationship with Address entity

  @OneToMany(() => Order, order => order.user)
  orders: Order[]; // Establish the relationship with Order entity

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
