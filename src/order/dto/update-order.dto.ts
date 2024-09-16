import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, IsUUID } from 'class-validator';

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
      'a3c95e4f-2d6b-4e1e-b6a6-8c8d0e65c4d9'
    ],
    description: 'Optional array of product IDs',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  productIds?: string[];

  @ApiProperty({
    example: 99.99,
    description: 'Optional total cost of the order',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({
    example: 'Shipped',
    description: 'Optional status of the order',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: '2024-09-15T10:30:00Z',
    description: 'Optional date of the order (auto-generated)',
    required: false,
  })
  @IsOptional()
  date?: Date;
}