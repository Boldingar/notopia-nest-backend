import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  @ApiResponse({ status: 201, description: 'The voucher has been successfully created.', type: Voucher })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vouchers' })
  @ApiResponse({ status: 200, description: 'Return all vouchers.', type: [Voucher] })
  @ApiResponse({ status: 404, description: 'No vouchers found.' })
  findAll() {
    return this.voucherService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a voucher by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the voucher to retrieve' })
  @ApiResponse({ status: 200, description: 'The voucher with the given ID.', type: Voucher })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a voucher by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the voucher to update' })
  @ApiResponse({ status: 200, description: 'The voucher has been successfully updated.', type: Voucher })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a voucher by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the voucher to delete' })
  @ApiResponse({ status: 200, description: 'The voucher has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Voucher not found.' })
  remove(@Param('id') id: string) {
    return this.voucherService.remove(id);
  }
}