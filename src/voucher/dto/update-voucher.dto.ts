import {
  IsString,
  IsOptional,
  IsDecimal,
  ValidateIf,
  Min,
  Max,
  IsDate,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVoucherDto } from './create-voucher.dto';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
  @ApiProperty({
    example: 'WINTER_SALE',
    description: 'Unique name for the voucher',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'End date for the voucher',
    required: false,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
