import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from './entities/address.entity'; // Import the Address entity
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User]),forwardRef(() =>UserModule)],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService], // Export AddressService if needed in other modules
})
export class AddressModule {}
