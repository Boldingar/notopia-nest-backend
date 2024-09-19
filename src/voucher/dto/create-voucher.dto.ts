import { IsString, IsNotEmpty, IsDecimal, ValidateIf, Min, Max, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherDto {
  @ApiProperty({
    example: 'SUMMER_SALE',
    description: 'Unique name for the voucher',
  })
  @IsString()
  @IsNotEmpty()
  name: string; // The voucher name must be a non-empty string

  @ApiProperty({
    example: 15.5,
    description: 'Discount percentage (0-100), either this or discount value',
    required: false,
  })
  @IsDecimal()
  @ValidateIf(o => o.discountValue === undefined) // Ensures discountPercentage is used only if discountValue is not present
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiProperty({
    example: 50.00,
    description: 'Flat discount value in currency, either this or discount percentage',
    required: false,
  })
  @IsDecimal()
  @ValidateIf(o => o.discountPercentage === undefined) // Ensures discountValue is used only if discountPercentage is not present
  @Min(0)
  discountValue?: number;

  @ApiProperty({
    example: '2024-12-31',
    description: 'End date for the voucher',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date; // End date is now required
}
