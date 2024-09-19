import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsDecimal,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ProductType } from '../entities/product.entity'; // Import the enum

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
    required: false,
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  cost?: number;

  @ApiProperty({
    example: '1234567890123',
    required: false,
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    example: ['b5508d57-d3d5-4b78-97f2-d7f565b6e0cb', 'a6409c67-e6d4-4e78-92d1-c1f5d123456f'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @ApiProperty({
    example: 'Main',
    enum: ProductType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiProperty({
    example: ['b5508d57-d3d5-4b78-97f2-d7f565b6e0cb', 'a6409c67-e6d4-4e78-92d1-c1f5d123456f'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  linkedProducts?: string[];
}
