import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({ description: 'The product id' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ description: 'The user id' })
  @IsString()
  @IsNotEmpty()
  user: string;
}
