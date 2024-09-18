import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsDecimal,
  IsUUID,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Updated Product Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Updated Product Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'http://example.com/image3.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainImage?: string;

  @ApiProperty({
    example: ['http://example.com/image3.jpg', 'http://example.com/image4.jpg'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    example: 249.99,
    required: false,
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  price?: number;

  @ApiProperty({
    example: 15.0,
    required: false,
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  discountPercentage?: number;

  @ApiProperty({
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  numberOfSales?: number;

  @ApiProperty({
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  stock?: number;
  @ApiProperty({
    example: 100.0,
  })
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  cost?: number;
  @ApiProperty({
    example: 'd3d5e43b-0c5b-4a58-8a8c-d4c9d678c7d4',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string; // Optional ID of the category to which the product belongs
}