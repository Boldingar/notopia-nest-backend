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
    example: 'https://example.com/image.png',
    description: 'Optional URL for the category image',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryImgUrl?: string;
}