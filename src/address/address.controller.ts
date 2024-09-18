import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';


@ApiTags('address') // Group the controller under 'address' in Swagger UI
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'The address has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  @ApiBody({ type: CreateAddressDto }) // Document the body input
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @ApiOperation({ summary: 'Get all addresses' })
  @ApiResponse({ status: 200, description: 'List of all addresses' })
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @ApiOperation({ summary: 'Get an address by ID' })
  @ApiResponse({ status: 200, description: 'Address found' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the address' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({ status: 200, description: 'The address has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the address' })
  @Patch(':id')
  @ApiBody({ type: UpdateAddressDto }) // Document the body input for the update
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address has been deleted.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the address' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }

  @ApiOperation({ summary: 'Get addresses by user ID' })
  @ApiResponse({ status: 200, description: 'List of addresses', type: [Address] })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: String, required: true, description: 'User ID' })
  @Get('user/:userId')
  getAddressesByUserId(@Param('userId') userId: string): Promise<Address[]> {
    return this.addressService.findAddressesByUserId(userId);
  }
}
