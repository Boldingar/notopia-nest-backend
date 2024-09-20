import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  imgUrl: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
