import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { DeliveryModule } from 'src/delivery/delivery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Delivery]),
    UserModule,
    DeliveryModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
