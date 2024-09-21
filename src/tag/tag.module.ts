import { forwardRef, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), forwardRef(() => ProductModule)],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
