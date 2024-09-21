import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
    @ApiProperty({
        example: 'Zara',
        description: 'The updated name of the brand',
        required: false,
      })
      @IsOptional()
      @IsString()
      brandName?: string;
    
      @ApiProperty({
        example:'http://example.com/image3.jpg',
        type: 'string',
        format: 'binary',
        description: 'Category image file',
        required: false,
      })
      @IsOptional()
      @IsString()
      brandImgUrl?: string;
}
