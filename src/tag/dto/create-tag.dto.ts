import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'Summer Collection' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;
}
