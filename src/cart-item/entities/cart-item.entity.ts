import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  counter: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => User, (user) => user.cart)
  user: User;
}
