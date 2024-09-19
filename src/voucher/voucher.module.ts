import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher]), VoucherModule],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
