import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';
import { IsString } from 'class-validator';

export class UpdateDeliveryDto {
  @IsString()
  status: string; // Either "Delivering" or "Delivered"
}
