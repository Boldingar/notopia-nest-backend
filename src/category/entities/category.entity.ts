import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  categoryName: string;

  @Column('text', { nullable: true })
  categoryImgUrl: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
