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

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, Address, Voucher]), forwardRef(() => AddressModule), forwardRef(() =>OrderModule), ProductModule, VoucherModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
