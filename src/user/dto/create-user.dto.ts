import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNotEmpty,IsEnum, IsOptional, IsArray } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '01003847394',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    example: 'Male',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    example: 'customer',
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
  cart?: Product[];

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
  wishlist?: Product[]; 
}