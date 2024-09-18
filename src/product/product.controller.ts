import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, InternalServerErrorException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';


@ApiTags('product') // Group the controller under 'product' in Swagger UI
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  @ApiBody({ type: CreateProductDto }) // Document the body input
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @Patch(':id')
  @ApiBody({ type: UpdateProductDto }) // Document the body input for the update
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product has been deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @ApiOperation({ summary: 'Search products by name' })
  @ApiResponse({ status: 200, description: 'List of products matching the search name', type: [Product] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'search', required: true, description: 'Name to search for products' })
  @Get('search/:search')
  @UsePipes(new ValidationPipe({ transform: true }))
  search(@Param('search') name: string): Promise<Product[]> {
    return this.productService.searchProductsByName(name);
  }

}
