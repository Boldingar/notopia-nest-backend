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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@ApiTags('brand')
@ApiBearerAuth('Bearer')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
    status: 201,
    description: 'Brand has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Failed to create brand.' })
  @Post()
  @ApiBody({ type: CreateBrandDto })
  async create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      return await this.brandService.create(createBrandDto);
    } catch (error) {
      throw new HttpException('Failed to create brand', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'List of all brands.' })
  @Get()
  async findAll(): Promise<Brand[]> {
    try {
      return await this.brandService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get brands',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get top-selling brands' })
  @ApiResponse({ status: 200, description: 'Top-selling brands ranked.' })
  @Get('top-selling')
  async findTopSellingBrands(): Promise<
    { brandName: string; totalSales: number }[]
  > {
    try {
      return await this.brandService.findTopSellingCategories();
    } catch (error) {
      throw new HttpException(
        'Failed to get top-selling brands',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand found.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Brand> {
    try {
      const brand = await this.brandService.findOne(id);
      if (!brand) {
        throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
      }
      return brand;
    } catch (error) {
      throw new HttpException(
        'Failed to get brand',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get all products associated with a brand' })
  @ApiResponse({ status: 200, description: 'List of products for the brand.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Get(':id/products')
  async findProducts(@Param('id') id: string): Promise<any[]> {
    try {
      const products = await this.brandService.findProducts(id);
      if (!products) {
        throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
      }
      return products;
    } catch (error) {
      throw new HttpException(
        'Failed to get products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Update a brand' })
  @ApiResponse({
    status: 200,
    description: 'Brand has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Patch(':id')
  @ApiBody({ type: UpdateBrandDto })
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    try {
      const updatedBrand = await this.brandService.update(id, updateBrandDto);
      if (!updatedBrand) {
        throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
      }
      return updatedBrand;
    } catch (error) {
      throw new HttpException(
        'Failed to update brand',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Delete a brand' })
  @ApiResponse({ status: 200, description: 'Brand has been deleted.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.brandService.remove(id);
      if (!result) {
        throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete brand',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
