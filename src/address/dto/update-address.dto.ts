import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({
    example: '123 Elm Street',
    description: 'The street address',
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'The apartment number',
    required: false,
  })
  @IsOptional()
  @IsString()
  appartmentNumber?: string;

  @ApiProperty({
    example: '5th',
    description: 'The floor number',
    required: false,
  })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiProperty({
    example: '10',
    description: 'The building number',
    required: false,
  })
  @IsOptional()
  @IsString()
  buildingNumber?: string;

  @ApiProperty({
    example: 'Residential',
    description: 'Type of location, e.g., Residential or Commercial',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationType?: string;

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
    required: false,
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({
    example: 'user-uuid-1234',
    description: 'The ID of the user associated with the address',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}