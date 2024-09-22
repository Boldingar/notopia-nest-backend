import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('cart-item')
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart item' })
  @ApiResponse({
    status: 201,
    description: 'The cart item has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateCartItemDto })
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cart items' })
  @ApiResponse({ status: 200, description: 'Return all cart items.' })
  findAll() {
    return this.cartItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart item by ID' })
  @ApiResponse({ status: 200, description: 'Return the cart item.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  findOne(@Param('id') id: string) {
    return this.cartItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  @ApiBody({ type: UpdateCartItemDto })
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(id, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(id);
  }

  @Put(':id/increment')
  @ApiOperation({ summary: 'Increment the counter of a cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The counter has been successfully incremented.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  incrementCounter(@Param('id') id: string) {
    return this.cartItemService.incrementCounter(id);
  }

  @Put(':id/decrement')
  @ApiOperation({ summary: 'Decrement the counter of a cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The counter has been successfully decremented.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  decrementCounter(@Param('id') id: string) {
    return this.cartItemService.decrementCounter(id);
  }
}
