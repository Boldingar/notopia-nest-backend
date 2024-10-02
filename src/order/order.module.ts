import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { CartItemController } from 'src/cart-item/cart-item.controller';
import { CartItemModule } from 'src/cart-item/cart-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, User, CartItem]),
    forwardRef(() => UserModule),
    ProductModule,
    forwardRef(() => CartItemModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
