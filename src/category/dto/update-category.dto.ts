import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Home Appliances',
    description: 'The updated name of the category',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryName?: string;

  @ApiProperty({
    example: 'https://example.com/new-image.png',
    description: 'Optional updated URL for the category image',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryImgUrl?: string;
}