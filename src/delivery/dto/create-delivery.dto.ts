import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Order } from 'src/order/entities/order.entity';
import { Column } from 'typeorm';

export class CreateDeliveryDto {
  // @ApiProperty({
  //   example: 'ae908d38-613e-4850-a0e9-5a27743c74ab',
  //   description: 'Order ID',
  //   required: true,
  // })
  // @IsString()
  // orderId: string; // Order ID as reference

  // @ApiProperty({
  //   example: 'ae908d38-613e-4850-a0e9-5a27743c74ab',
  //   description: 'Delivery man ID',
  //   required: true,
  // })
 
  @IsUUID()
  deliveryManId: string; // DeliveryMan ID as reference (assuming it's a user)

  @ApiProperty({
    example: 'Order',
    description: 'Order details',
  })
  @Column()
  currentOrder: Order;

  @Column({ length: 25 })
  name: string;

  @Column({ length: 15, unique: true })
  phone: string;

  @ApiProperty({
    example: '2024-09-15T10:30:00Z',
    description: 'Date of delivery completeness',
    required: false,
  })
  @IsOptional()
  dateOfDelivery?: Date;

  @ApiProperty({
    example: '2024-09-15T10:30:00Z',
    description: 'Date of order assingment',
    required: true,
  })
  @Column()
  dateOfAssingment?: Date;

}
