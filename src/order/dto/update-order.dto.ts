import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'f8d85e3e-1c2b-4e1e-b6a6-8c8d0e65c4d8',
    description: 'Optional ID of the user placing the order',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @ApiProperty({
    example: [
      'b1d85e3e-1c2b-4e1e-b6a6-8c8d0e65c4d8',
      'a3c95e4f-2d6b-4e1e-b6a6-8c8d0e65c4d9',
    ],
    description: 'Array of cart item IDs',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  products?: string[];

  @ApiProperty({
    example: 99.99,
    description: 'Optional total cost of the order',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 'Shipped',
    description: 'Optional status of the order',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: 'd1234567-89ab-cdef-0123-456789abcdef',
    description: 'ID of the delivery associated with the order',
    required: false,
  })
  @IsOptional()
  deliveryId?: string;

  @ApiProperty({
    example: '2024-09-30T12:00:00Z',
    description: 'Scheduled delivery date and time',
    required: false,
  })
  @IsOptional()
  @IsDate()
  scheduleDelivery?: Date;
}
