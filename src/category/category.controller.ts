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
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { Roles } from 'src/decorators/Role.decorator';
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '..', '..', 'src', 'images', 'categories')); 
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `category-${uuidv4()}.${ext}`);
  },
});
@ApiTags('category')
@ApiBearerAuth('Bearer')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Roles('admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('categoryImgUrl', { storage: multerStorage }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCategoryDto })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() categoryImg: Express.Multer.File,
  ) {
    if (!categoryImg) {
      return this.categoryService.create(createCategoryDto);
    }
    const categoryImgUrl = `/images/categories/${categoryImg.filename}`;
    createCategoryDto.categoryImgUrl = categoryImgUrl;
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories without products',
  })
  @Roles('admin', 'customer', 'delivery', 'stock')
  @Get()
  findAll() {
    return this.categoryService.findCategories();
  }

  @ApiOperation({ summary: 'Get all categories with products' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories without products',
  })
  @Roles('admin', 'customer', 'delivery', 'stock')
  @Get('/details')
  findAllDetails() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get categories number of sales' })
  @ApiResponse({ status: 200, description: 'Categories ranked by sales.' })
  @Roles('admin', 'customer', 'delivery', 'stock')
  @Get('topSelling')
  async findTopSellingCategories(): Promise<
    { categoryName: string; totalSales: number }[]
  > {
    return this.categoryService.findTopSellingCategories();
  }

  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Roles('admin', 'customer', 'delivery', 'stock')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Get products of a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'List of products in the specified category',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Roles('admin', 'customer', 'delivery', 'stock')
  @Get(':id/products')
  findProducts(@Param('id') id: string) {
    return this.categoryService.findProducts(id);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Roles('admin')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('categoryImgUrl', { storage: multerStorage }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCategoryDto })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() categoryImg: Express.Multer.File,
  ) {
    if (!categoryImg) {
      return this.categoryService.update(id, updateCategoryDto);
    }
    const categoryImgUrl = `/images/categories/${categoryImg.filename}`;
    updateCategoryDto.categoryImgUrl = categoryImgUrl;
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category has been deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
