import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Tag } from 'src/tag/entities/tag.entity';

export enum ProductType {
  MAIN = 'Main',
  SIDE = 'Side',
}

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ length: 50, unique: true, nullable: true })
  barcode: string;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Column({
    type: 'enum',
    enum: ProductType,
    nullable: true,
  })
  type: ProductType;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'linked_products',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'linked_product_id',
      referencedColumnName: 'id',
    },
  })
  linkedProducts: Product[];

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
