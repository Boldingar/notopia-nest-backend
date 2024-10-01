import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  brandName: string;

  @Column('text', { nullable: true })
  brandImgUrl: string;

  @OneToMany(() => Product, (product) => product.brand, {
    onDelete: 'SET NULL',
  })
  products: Product[];
}
