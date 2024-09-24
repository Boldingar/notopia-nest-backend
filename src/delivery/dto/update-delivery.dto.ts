import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

export class UpdateDeliveryDto {

  @Column()
  currentOrder?: Order;

  @Column({ length: 25 })
  name?: string;

  @Column()
  password?: string;

  // @ApiProperty({
  //   example: 'stockMan or deliveryMan',
  //   description: 'Order details',
  // })
  @Column({ length: 15 })
  role?: string;

  @Column({ length: 15, unique: true })
  phone?: string;
}
