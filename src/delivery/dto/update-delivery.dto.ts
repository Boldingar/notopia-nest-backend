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
  currentOrder?: Order;

  @Column({ length: 25 })
  name?: string;

  @Column({ length: 15, unique: true })
  phone?: string;

  @ApiProperty({
    required: false,
  })
  @Column()
  dateOfAssingment?: Date;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  dateOfDelivery?: Date;


}
