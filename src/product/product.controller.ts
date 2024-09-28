import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
  UsePipes,
  Query,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { Product } from './entities/product.entity';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '..', '..', 'src', 'images', 'product'));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `product-${uuidv4()}.${ext}`);
  },
});

@ApiTags('product')
@ApiBearerAuth('Bearer')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  @UseInterceptors(FilesInterceptor('images', 15, { storage: multerStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      return this.productService.create(createProductDto);
    }

    const mainImagePath = `/images/product/${files[0].filename}`;
    const imagePaths = files
      .slice(1)
      .map((file) => `/images/product/${file.filename}`);

    createProductDto.mainImage = mainImagePath;
    createProductDto.images = imagePaths;
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get top-selling products' })
  @ApiResponse({
    status: 200,
    description: 'Products ranked by number of sales',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('topSelling')
  async findTopSellingProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    data: { product: Product; numberOfSales: number }[];
    total: number;
  }> {
    return this.productService.findTopSellingProducts(page, limit);
  }
  
  @ApiOperation({ summary: 'Get new arrivals in the last 5 days' })
  @ApiResponse({
    status: 200,
    description: 'List of new products created in the last 5 days',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('newArrivals')
  async getNewArrivals(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    return this.productService.newArrivals(page, limit);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.productService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Get Main products' })
  @ApiResponse({ status: 200, description: 'List of all main products' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('main')
  findMain(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.productService.findMain(page, limit);
  }

  @ApiOperation({ summary: 'Get Side products' })
  @ApiResponse({ status: 200, description: 'List of all side products' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('side')
  findSide(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.productService.findSide(page, limit);
  }

  @ApiOperation({ summary: 'Get flash-sales products' })
  @ApiResponse({
    status: 200,
    description: 'Products of discount more than 30% sale',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('flashSale')
  async getFlashSales(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    return this.productService.getFlashSales(page, limit);
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Get linked products by product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('linked/:id')
  findLinkedProducts(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.productService.findLinkedProducts(id, page, limit);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 15, { storage: multerStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      return this.productService.update(id, updateProductDto);
    }

    const mainImagePath = `/images/product/${files[0].filename}`;
    const imagePaths = files
      .slice(1)
      .map((file) => `/images/product/${file.filename}`);

    updateProductDto.mainImage = mainImagePath;
    updateProductDto.images = imagePaths;
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
  @ApiResponse({
    status: 200,
    description: 'List of products matching the search',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({
    name: 'search',
    required: true,
    description: 'Name to search for products',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('search/:search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(
    @Param('search') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    return this.productService.searchProductsByName(name, page, limit);
  }
}
