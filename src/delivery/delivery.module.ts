import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Delivery } from './entities/delivery.entity'; // Delivery entity
import { OrderModule } from '../order/order.module'; // Handle deliveries for orders
import { UserModule } from '../user/user.module'; // Circular dependency handling
import { ProductModule } from '../product/product.module'; // Optional for products
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery, User, Order, Product]), // TypeORM repository for Delivery entity
    forwardRef(() => OrderModule), // Handle circular dependencies with OrderModule
    forwardRef(() => UserModule), // Handle circular dependencies with UserModule
    ProductModule, // Optional, if you need to interact with products
  ],
  controllers: [DeliveryController], // Controller to handle delivery-related requests
  providers: [DeliveryService], // Business logic for deliveries
  exports: [DeliveryService], // Exporting service so it can be used elsewhere
})
export class DeliveryModule {}
