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
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { Product } from 'src/product/entities/product.entity';

@ApiTags('tags')
@ApiBearerAuth('Bearer')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
    type: Tag,
  })
  @ApiResponse({ status: 400, description: 'Failed to create tag' })
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      return await this.tagService.create(createTagDto);
    } catch (error) {
      throw new HttpException('Failed to create tag', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Retrieve all tags with their associated products' })
  @ApiResponse({ status: 200, description: 'Return all tags', type: [Tag] })
  @Get()
  async findAll() {
    try {
      return await this.tagService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get tags',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Retrieve top-selling tags based on product sales' })
  @ApiResponse({
    status: 200,
    description: 'Return top-selling tags',
    type: [Tag],
  })
  @Get('top-selling')
  async findTopSellingTags() {
    try {
      return await this.tagService.findTopSellingTags();
    } catch (error) {
      throw new HttpException(
        'Failed to get top-selling tags',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Retrieve a single tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag' })
  @ApiResponse({ status: 200, description: 'Return a single tag', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const tag = await this.tagService.findOne(id);
      if (!tag) {
        throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
      }
      return tag;
    } catch (error) {
      throw new HttpException(
        'Failed to get tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag to update' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: 200,
    description: 'The tag has been updated',
    type: Tag,
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    try {
      const updatedTag = await this.tagService.update(id, updateTagDto);
      if (!updatedTag) {
        throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
      }
      return updatedTag;
    } catch (error) {
      throw new HttpException(
        'Failed to update tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag to delete' })
  @ApiResponse({ status: 204, description: 'Tag successfully deleted' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.tagService.remove(id);
      if (!result) {
        throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Find products associated with a tag by tag ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag' })
  @ApiResponse({
    status: 200,
    description: 'Return the associated products',
    type: [Product],
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Get(':id/products')
  async findProducts(@Param('id') id: string) {
    try {
      return await this.tagService.findProducts(id);
    } catch (error) {
      throw new HttpException(
        'Failed to get products for tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
