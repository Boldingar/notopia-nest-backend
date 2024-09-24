import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    try {
      const { discountPercentage, discountValue } = createVoucherDto;

      if (
        (discountPercentage !== undefined && discountValue !== undefined) ||
        (discountPercentage === undefined && discountValue === undefined)
      ) {
        throw new BadRequestException(
          'You must provide either discountPercentage or discountValue, but not both.',
        );
      }

      const newVoucher = this.voucherRepository.create(createVoucherDto);
      return await this.voucherRepository.save(newVoucher);
    } catch (error) {
      console.error('Error creating voucher:', error);
      throw new InternalServerErrorException('Failed to create voucher');
    }
  }

  async findAll(): Promise<Voucher[]> {
    try {
      return await this.voucherRepository.find();
    } catch (error) {
      console.error('Error finding all vouchers:', error);
      throw new InternalServerErrorException('Failed to find all vouchers');
    }
  }

  async findOne(id: string): Promise<Voucher> {
    try {
      const voucher = await this.voucherRepository.findOne({
        where: { id },
      });
      if (!voucher) {
        throw new NotFoundException(`Voucher with ID ${id} not found`);
      }
      return voucher;
    } catch (error) {
      console.error('Error finding voucher:', error);
      throw new InternalServerErrorException('Failed to find voucher');
    }
  }

  async update(
    id: string,
    updateVoucherDto: UpdateVoucherDto,
  ): Promise<Voucher> {
    try {
      const { discountPercentage, discountValue } = updateVoucherDto;

      if (
        (discountPercentage !== undefined && discountValue !== undefined) ||
        (discountPercentage === undefined && discountValue === undefined)
      ) {
        throw new BadRequestException(
          'You must provide either discountPercentage or discountValue, but not both.',
        );
      }

      const voucher = await this.voucherRepository.preload({
        id: id,
        ...updateVoucherDto,
      });
      if (!voucher) {
        throw new NotFoundException(`Voucher with ID ${id} not found`);
      }

      return await this.voucherRepository.save(voucher);
    } catch (error) {
      console.error('Error updating voucher:', error);
      throw new InternalServerErrorException('Failed to update voucher');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.voucherRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Voucher with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      console.error('Error deleting voucher:', error);
      throw new InternalServerErrorException('Failed to delete voucher');
    }
  }
}
