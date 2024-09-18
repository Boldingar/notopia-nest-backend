import { IsString, IsOptional, IsDecimal, ValidateIf, Min, Max, IsDate } from 'class-validator';
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
    example: 20,
    description: 'Discount percentage (0-100)',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  @ValidateIf(o => o.discountValue === undefined) // Ensures discountPercentage is updated only if discountValue is not provided
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiProperty({
    example: 75.00,
    description: 'Flat discount value in currency',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  @ValidateIf(o => o.discountPercentage === undefined) // Ensures discountValue is updated only if discountPercentage is not provided
  @Min(0)
  discountValue?: number;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'End date for the voucher',
    required: false,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
