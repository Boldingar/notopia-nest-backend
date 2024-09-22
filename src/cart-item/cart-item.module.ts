
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, User, Product]),
    forwardRef(() => ProductModule),
    forwardRef(() => UserModule),
  ],
  providers: [CartItemService],
  controllers: [CartItemController],
  exports: [TypeOrmModule],
})
export class CartItemModule {}
