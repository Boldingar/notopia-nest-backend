import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/create-authentication.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Delivery } from 'src/delivery/entities/delivery.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async login(loginDto: LoginDto) {
    const { phoneNumber } = loginDto;

    const user = await this.userRepository.findOne({
      where: { phone: phoneNumber, isDeleted: false },
      relations: ['cart', 'wishlist', 'addresses', 'orders'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const result = await bcrypt.compare(loginDto.password, user.password);

    if (!result) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign(
      { id: user.id, flag: user.flag },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );

    return { token, flag: user.flag, user };
  }

  async deliveryLogin(loginDto: LoginDto) {
    const { phoneNumber } = loginDto;

    const delivery = await this.deliveryRepository.findOne({
      where: { phone: phoneNumber, isDeleted: false },
    });

    if (!delivery) throw new UnauthorizedException('Invalid credentials');

    const result = await bcrypt.compare(loginDto.password, delivery.password);

    if (!result) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign(
      { id: delivery.id, flag: delivery.flag },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );

    return { token, flag: delivery.flag, delivery };
  }

  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
