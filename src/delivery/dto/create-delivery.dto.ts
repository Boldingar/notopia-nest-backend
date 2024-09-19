import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator';

export class CreateDeliveryDto {
  @IsUUID()
  orderId: string; // Order ID as reference

  @IsUUID()
  deliveryManId: string; // DeliveryMan ID as reference (assuming it's a user)

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
    required: false,
  })
  @IsOptional()
  dateOfAssingment?: Date; 

  @IsNumber()
  totalCost: number; // Total cost inckuding the delivery fees 
}
