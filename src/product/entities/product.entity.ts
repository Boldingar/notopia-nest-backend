import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  discountPercentage: number;

  @Column('text', { nullable: true })
  mainImage: string;

  @Column('text', { array: true, default: [], nullable: true })
  images: string[];

  @Column({ length: 100 })
  name: string;

  @Column('int')
  numberOfSales: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
  cost: number;
  
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}