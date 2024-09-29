import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

export class UpdateDeliveryDto {
  @Column()
  currentOrder?: Order;

  @Column({ length: 25 })
  name?: string;

  @Column()
  password?: string;

  @IsEnum(['delivery', 'stock'], {
    message: 'flag must be either "delivery" or "stock"',
  })
  flag: 'delivery' | 'stock';

  @Column({ length: 15, unique: true })
  phone?: string;
}
