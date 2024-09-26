import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
  @ApiProperty({
    description:
      'User phone number in international format, starting with a + and followed by 10-15 digits.',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'User password, must be at least 8 characters long.',
    example: 'strongPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
