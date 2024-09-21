import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    const { discountPercentage, discountValue } = createVoucherDto;

    if ((discountPercentage !== undefined && discountValue !== undefined) ||
        (discountPercentage === undefined && discountValue === undefined)) {
      throw new BadRequestException('You must provide either discountPercentage or discountValue, but not both.');
    }

    const newVoucher = this.voucherRepository.create(createVoucherDto);
    return this.voucherRepository.save(newVoucher);
  }

  async findAll(): Promise<Voucher[]> {
    return this.voucherRepository.find();
  }

  async findOne(id: string): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { id },
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return voucher;
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
    const { discountPercentage, discountValue } = updateVoucherDto;

    if ((discountPercentage !== undefined && discountValue !== undefined) ||
        (discountPercentage === undefined && discountValue === undefined)) {
      throw new BadRequestException('You must provide either discountPercentage or discountValue, but not both.');
    }

    const voucher = await this.voucherRepository.preload({
      id: id,
      ...updateVoucherDto,
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }

    return this.voucherRepository.save(voucher);
  }

  async remove(id: string): Promise<void> {
    const result = await this.voucherRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
  }
}