import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from 'src/category/category.module';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandModule } from 'src/brand/brand.module';
import { Brand } from 'src/brand/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category,Brand]),CategoryModule,BrandModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule],
})
export class ProductModule {}
