import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Delivery } from './entities/delivery.entity';
import { OrderModule } from '../order/order.module'; 
import { UserModule } from '../user/user.module'; 
import { ProductModule } from '../product/product.module'; 
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery, User, Order, Product]), 
    forwardRef(() => OrderModule), 
    forwardRef(() => UserModule), 
    ProductModule, 
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService], 
  exports: [DeliveryService], 
})
export class DeliveryModule {}
