import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  @ApiBody({ type: CreateCategoryDto }) 
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of all categories without products' })
  @Get()
  findAll() {
    return this.categoryService.findCategories();
  }

  @ApiOperation({ summary: 'Get all categories with products' })
  @ApiResponse({ status: 200, description: 'List of all categories without products' })
  @Get('/details')
  findAllDetails() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get categories number of sales' })
  @ApiResponse({ status: 200, description: 'Categories ranked by sales.' })
  @Get('topSelling')
  async findTopSellingCategories(): Promise<{ categoryName: string; totalSales: number }[]> {
    return this.categoryService.findTopSellingCategories();
  }

  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Get products of a category by ID' })
  @ApiResponse({ status: 200, description: 'List of products in the specified category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Get(':id/products')
  findProducts(@Param('id') id: string) {
    return this.categoryService.findProducts(id);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'The category has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDto })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category has been deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
