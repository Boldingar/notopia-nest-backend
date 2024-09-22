import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/address/entities/address.entity';
import { User } from './entities/user.entity';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';
import { AddressModule } from 'src/address/address.module';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import { VoucherModule } from 'src/voucher/voucher.module';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { CartItemModule } from 'src/cart-item/cart-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Order,
      Address,
      Voucher,
      CartItem,
    ]),
    forwardRef(() => AddressModule),
    forwardRef(() => OrderModule),
    ProductModule,
    VoucherModule,
    CartItemModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
