import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional} from 'class-validator';
export class CreateBrandDto {
  @ApiProperty({
    example: 'Zara',
    description: 'The name of the brand',
  })
  @IsString()
  brandName: string;

  @ApiProperty({
    example: 'http://example.com/image3.jpg',
    type: 'string',
    format: 'binary',
    description: 'Brand image file',
    required: false,
  })
  @IsOptional()
  brandImgUrl?: string;

}
