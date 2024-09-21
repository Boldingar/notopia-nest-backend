import { IsString, IsNotEmpty, IsDecimal, ValidateIf, Min, Max, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherDto {
  @ApiProperty({
    example: 'SUMMER_SALE',
    description: 'Unique name for the voucher',
  })
  @IsString()
  @IsNotEmpty()
  name: string; 

  @ApiProperty({
    example: 15.5,
    description: 'Discount percentage (0-100), either this or discount value',
    required: false,
  })
  @IsDecimal()
  @ValidateIf(o => o.discountValue === undefined) 
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiProperty({
    example: 50.00,
    description: 'Flat discount value in currency, either this or discount percentage',
    required: false,
  })
  @IsDecimal()
  @ValidateIf(o => o.discountPercentage === undefined) 
  @Min(0)
  discountValue?: number;

  @ApiProperty({
    example: '2024-12-31',
    description: 'End date for the voucher',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
