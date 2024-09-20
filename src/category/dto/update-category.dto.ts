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
    type: 'string',
    format: 'binary',
    description: 'Category image file',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryImgUrl?: string;
}