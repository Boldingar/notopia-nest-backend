import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from './entities/voucher.entity';

@ApiTags('vouchers')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new voucher' })
  @ApiResponse({
    status: 201,
    description: 'The voucher has been successfully created.',
    type: Voucher,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    try {
      return await this.voucherService.create(createVoucherDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create voucher',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all vouchers' })
  @ApiResponse({
    status: 200,
    description: 'Return all vouchers.',
    type: [Voucher],
  })
  @ApiResponse({ status: 404, description: 'No vouchers found.' })
  async findAll() {
    try {
      return await this.voucherService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get vouchers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a voucher by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the voucher to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The voucher with the given ID.',
    type: Voucher,
  })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const voucher = await this.voucherService.findOne(id);
      if (!voucher) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }
      return voucher;
    } catch (error) {
      throw new HttpException(
        'Failed to get voucher',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a voucher by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the voucher to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The voucher has been successfully updated.',
    type: Voucher,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    try {
      const updatedVoucher = await this.voucherService.update(
        id,
        updateVoucherDto,
      );
      if (!updatedVoucher) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }
      return updatedVoucher;
    } catch (error) {
      throw new HttpException(
        'Failed to update voucher',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a voucher by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the voucher to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The voucher has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.voucherService.remove(id);
      if (!result) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete voucher',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
