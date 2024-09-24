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
  @ApiProperty({
    example: 'Ali',
    description: 'Driver name',
  })
  @IsNotEmpty()
  @Column({ length: 25 })
  name: string;

  @ApiProperty({
    example: 'password@123',
    description: 'Driver password',
  })
  @Column()
  password?: string;

  @ApiProperty({
    example: 'deliveryMan or stockMan',
    description: 'Driver role',
  })
  @Column({ length: 15 })
  role?: string;

  @ApiProperty({
    example: '01222222222',
    description: 'Driver phone',
  })
  @Column({ length: 15, unique: true })
  @IsNotEmpty()
  phone: string;
}
