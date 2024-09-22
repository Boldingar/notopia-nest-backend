import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ProductModule } from './product/product.module';
import { VoucherModule } from './voucher/voucher.module';
import { ReviewModule } from './review/review.module';
import { AddressModule } from './address/address.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { Delivery } from './delivery/entities/delivery.entity';


import { User } from './user/entities/user.entity';
import { Order } from './order/entities/order.entity';
import { Product } from './product/entities/product.entity';
import { Voucher } from './voucher/entities/voucher.entity';
import { Review } from './review/entities/review.entity';
import { Address } from './address/entities/address.entity';
import { Tag } from './tag/entities/tag.entity';
import { Category } from './category/entities/category.entity';
import { BrandModule } from './brand/brand.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Brand } from './brand/entities/brand.entity';
import { CartItemModule } from './cart-item/cart-item.module';
import { CartItem } from './cart-item/entities/cart-item.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'images'), 
      serveRoot: '/images',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        ssl: {
          rejectUnauthorized: false, 
        },
        entities: [
          User,
          Order,
          Product,
          Voucher,
          Review,
          Address,
          Tag,
          Category,
          Delivery,
          Brand,
          CartItem
        ],
        synchronize: true,
      }),
    }),
    UserModule,
    OrderModule,
    ProductModule,
    VoucherModule,
    ReviewModule,
    AddressModule,
    TagModule,
    CategoryModule,
    BrandModule,
    DeliveryModule,
    CartItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
