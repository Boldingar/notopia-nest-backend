import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  categoryName: string;

  @Column({ length: 255, nullable: true })
  categoryImgUrl: string;

  @OneToMany(() => Product, product => product.category, { nullable: true })
  products: Product[];
}
