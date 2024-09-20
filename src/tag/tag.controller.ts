import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { Product } from 'src/product/entities/product.entity';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({ status: 201, description: 'The tag has been successfully created.', type: Tag })
  @ApiResponse({ status: 400, description: 'Failed to create tag' })
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @ApiOperation({ summary: 'Retrieve all tags with their associated products' })
  @ApiResponse({ status: 200, description: 'Return all tags', type: [Tag] })
  @Get()
  findAll() {
    return this.tagService.findAll();
  }
  
  @ApiOperation({ summary: 'Retrieve top-selling tags based on product sales' })
  @ApiResponse({ status: 200, description: 'Return top-selling tags', type: [Tag] })
  @Get('top-selling')
  findTopSellingTags() {
    return this.tagService.findTopSellingTags();
  }
  
  @ApiOperation({ summary: 'Retrieve a single tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag' })
  @ApiResponse({ status: 200, description: 'Return a single tag', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag to update' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({ status: 200, description: 'The tag has been updated', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag to delete' })
  @ApiResponse({ status: 204, description: 'Tag successfully deleted' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }

  @ApiOperation({ summary: 'Find products associated with a tag by tag ID' })
  @ApiParam({ name: 'id', description: 'The ID of the tag' })
  @ApiResponse({ status: 200, description: 'Return the associated products', type: [Product] })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Get(':id/products')
  findProducts(@Param('id') id: string) {
    return this.tagService.findProducts(id);
  }

}
