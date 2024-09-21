import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

export class UpdateDeliveryDto {

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
