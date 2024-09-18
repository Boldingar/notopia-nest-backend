import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

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
    enum: ['customer', 'admin'],
    nullable: true,
    default: 'customer'
  })
  flag: 'customer' | 'admin'; 

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
