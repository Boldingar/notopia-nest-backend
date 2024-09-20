import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './entities/brand.entity'; 
import { ProductModule } from 'src/product/product.module';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand,Product]),forwardRef(() => ProductModule),],

  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
