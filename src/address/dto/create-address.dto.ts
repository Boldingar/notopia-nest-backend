import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: '123 Elm Street',
    description: 'The street address',
  })
  @IsString()
  street: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'The apartment number',
  })
  @IsString()
  appartmentNumber: string;

  @ApiProperty({
    example: '5th',
    description: 'The floor number',
  })
  @IsString()
  floor: string;

  @ApiProperty({
    example: '10',
    description: 'The building number',
  })
  @IsString()
  buildingNumber: string;

  @ApiProperty({
    example: 'Residential',
    description: 'Type of location, e.g., Residential or Commercial',
  })
  @IsString()
  locationType: string;

  @ApiProperty({
    example: 'Home',
    description: 'An optional label for the address',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    example: 'Downtown',
    description: 'The district of the address',
  })
  @IsString()
  district: string;

  @ApiProperty({
    example: 'user-uuid-1234',
    description: 'The ID of the user associated with the address',
  })
  @IsUUID('4')
  userId: string;
}