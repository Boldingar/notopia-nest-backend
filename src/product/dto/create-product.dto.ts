import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsDecimal,
  IsUUID,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ProductType } from '../entities/product.entity'; // Import the enum from your entity

export class CreateProductDto {
  @ApiProperty({
    example: 'Product Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Sample Product',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'http://example.com/image3.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainImage?: string;

  @ApiProperty({
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: 199.99,
  })
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  price: number;

  @ApiProperty({
    example: 10.0,
  })
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  discountPercentage: number;

  @ApiProperty({
    example: 150,
  })
  @IsNumber()
  numberOfSales: number;

  @ApiProperty({
    example: 25,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    example: 100.0,
  })
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  cost: number;

  @ApiProperty({
    example: '1234567890123',
  })
  @IsString()
  barcode: string;

  @ApiProperty({
    example: ['b5508d57-d3d5-4b78-97f2-d7f565b6e0cb', 'a6409c67-e6d4-4e78-92d1-c1f5d123456f'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];

  @ApiProperty({
    example: 'Main',
    enum: ProductType,
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    example: ['b5508d57-d3d5-4b78-97f2-d7f565b6e0cb', 'a6409c67-e6d4-4e78-92d1-c1f5d123456f'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linkedProducts?: string[];
}
