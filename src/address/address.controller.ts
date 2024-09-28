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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { Roles } from 'src/decorators/Role.decorator';

@ApiTags('address')
@ApiBearerAuth('Bearer')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Roles('admin', 'customer')
  @Post()
  @ApiBody({ type: CreateAddressDto })
  async create(@Body() createAddressDto: CreateAddressDto) {
    try {
      return await this.addressService.create(createAddressDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create address',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Get all addresses' })
  @ApiResponse({ status: 200, description: 'List of all addresses' })
  @Roles('admin', 'delivery', 'customer')
  @Get()
  async findAll() {
    try {
      return await this.addressService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get addresses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get an address by ID' })
  @ApiResponse({ status: 200, description: 'Address found' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the address' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const address = await this.addressService.findOne(id);
      if (!address) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }
      return address;
    } catch (error) {
      throw new HttpException(
        'Failed to get address',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the address' })
  @Patch(':id')
  @ApiBody({ type: UpdateAddressDto })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    try {
      const updatedAddress = await this.addressService.update(
        id,
        updateAddressDto,
      );
      if (!updatedAddress) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }
      return updatedAddress;
    } catch (error) {
      throw new HttpException(
        'Failed to update address',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address has been deleted.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the address' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.addressService.remove(id);
      if (!result) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete address',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get addresses by user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of addresses',
    type: [Address],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    description: 'User ID',
  })
  @Get('user/:userId')
  async getAddressesByUserId(
    @Param('userId') userId: string,
  ): Promise<Address[]> {
    try {
      const addresses = await this.addressService.findAddressesByUserId(userId);
      if (!addresses || addresses.length === 0) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return addresses;
    } catch (error) {
      throw new HttpException(
        'Failed to get addresses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
