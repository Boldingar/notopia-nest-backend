import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  categoryName: string;

  @Column('text', { nullable: true })
  categoryImgUrl: string;

  @OneToMany(() => Product, (product) => product.categories, { nullable: true })
  products: Product[];
}
