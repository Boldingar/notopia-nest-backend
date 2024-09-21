import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Failed to create brand.' })
  @Post()
  @ApiBody({ type: CreateBrandDto })
  async create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandService.create(createBrandDto);
  }

  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'List of all brands.' })
  @Get()
  async findAll(): Promise<Brand[]> {
    return this.brandService.findAll();
  }

  @ApiOperation({ summary: 'Get top-selling brands' })
  @ApiResponse({ status: 200, description: 'Top-selling brands ranked.' })
  @Get('top-selling')
  async findTopSellingBrands(): Promise<{ brandName: string; totalSales: number }[]> {
    return this.brandService.findTopSellingCategories();
  }

  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand found.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Brand> {
    return this.brandService.findOne(id);
  }

  @ApiOperation({ summary: 'Get all products associated with a brand' })
  @ApiResponse({ status: 200, description: 'List of products for the brand.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Get(':id/products')
  async findProducts(@Param('id') id: string): Promise<any[]> {
    return this.brandService.findProducts(id);
  }

  @ApiOperation({ summary: 'Update a brand' })
  @ApiResponse({ status: 200, description: 'Brand has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Patch(':id')
  @ApiBody({ type: UpdateBrandDto })
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto): Promise<Brand> {
    return this.brandService.update(id, updateBrandDto);
  }

  @ApiOperation({ summary: 'Delete a brand' })
  @ApiResponse({ status: 200, description: 'Brand has been deleted.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.brandService.remove(id);
  }

}
