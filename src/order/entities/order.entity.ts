import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Product } from 'src/product/entities/product.entity'; // Import the Product entity
import { User } from 'src/user/entities/user.entity'; // Import the User entity

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToMany(() => Product, { eager: true }) // Define many-to-many relationship with Product
  @JoinTable()
  products: Product[];

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 50 })
  status: string;

  @CreateDateColumn({type:'timestamp'})
  createdAtDate: Date;

  @Column({ nullable: true }) 
  deliveryId: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

}
