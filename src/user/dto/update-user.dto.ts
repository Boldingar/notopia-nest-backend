import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString,IsEnum, IsOptional, IsArray } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'password123',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({
    example: 'Male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    example: 'Customer',
    required:false,
  })
  @IsEnum(['customer', 'admin'])
  @IsOptional()
  flag?: 'customer' | 'admin';

  @ApiProperty({
    example: [
      {
        id: '1',
        name: 'Product 1',
        price: 100,
        stock: 10,
      },
    ],
    type: [Product],
    required: false,
  })
  @IsOptional()
  @IsArray()
  cart?: Product[]; // Optional, to update the cart

  @ApiProperty({
    example: [
      {
        id: '2',
        name: 'Product 2',
        price: 200,
        stock: 5,
      },
    ],
    type: [Product],
    required: false,
  })
  @IsOptional()
  @IsArray()
  wishlist?: Product[]; // Optional, to update the wishlist
}