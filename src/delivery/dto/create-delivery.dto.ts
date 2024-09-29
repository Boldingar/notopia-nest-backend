import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
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
    example: 'delivery or stock',
    description: 'Driver flag',
  })
  @IsNotEmpty()
  @IsEnum(['delivery', 'stock'], {
    message: 'flag must be either "delivery" or "stock"',
  })
  flag: 'delivery' | 'stock';

  @ApiProperty({
    example: '01222222222',
    description: 'Driver phone',
  })
  @Column({ length: 15, unique: true })
  @IsNotEmpty()
  phone: string;
}
