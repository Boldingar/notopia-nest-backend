import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 5, scale: 2 })
  discountPercentage: number;

  @Column('text', { array: true, default: [] })
  imagesUrl: string[];

  @Column('int')
  numberOfSales: number;

  @Column('int')
  stock: number;

  @Column('decimal')
  cost: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;
}
