import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty({ example: 'Summer Collection' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;
}
