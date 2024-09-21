import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { User } from 'src/user/entities/user.entity'; 

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const { userId, ...addressData } = createAddressDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const address = this.addressRepository.create({
      ...addressData,
      User: user,
    });

    const savedAddress = await this.addressRepository.save(address);

    user.addresses.push(savedAddress);

    await this.userRepository.save(user);

    return savedAddress;
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['User'] });
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['User'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.preload({
      id,
      ...updateAddressDto,
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    if (updateAddressDto.userId) {
      const user = await this.userRepository.findOneBy({ id: updateAddressDto.userId });

      if (!user) {
        throw new NotFoundException(`User with ID ${updateAddressDto.userId} not found`);
      }

      address.User = user;
    }

    return this.addressRepository.save(address);
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
  }

  async findAddressesByUserId(userId: string): Promise<Address[]> {
    try {
      const user = await this.userRepository.findOne({where: {id:userId}})
      if(!user){
        throw new NotFoundException('User with ID ${userId} isnot found');
      }

      const addresses = await this.addressRepository.find({where: { User: { id: userId } }, relations: ['User'] });
      
      if(!addresses.length){
        throw new NotFoundException('No addresses are found for this user');
      }

      return addresses;
    } 
    catch (error) {
      throw new InternalServerErrorException('Failed to find addresses');
    }
  }
}
