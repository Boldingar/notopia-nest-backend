import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  @IsString()
  categoryName: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Category image file',
    required: false,
  })
  @IsOptional()
  categoryImgUrl?: string;
}