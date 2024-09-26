import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
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
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('cart-item')
@ApiBearerAuth('Bearer')
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cart items' })
  @ApiResponse({ status: 200, description: 'Return all cart items.' })
  async findAll() {
    try {
      return await this.cartItemService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get cart items',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart item by ID' })
  @ApiResponse({ status: 200, description: 'Return the cart item.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  async findOne(@Param('id') id: string) {
    try {
      const cartItem = await this.cartItemService.findOne(id);
      if (!cartItem) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }
      return cartItem;
    } catch (error) {
      throw new HttpException(
        'Failed to get cart item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.cartItemService.remove(id);
      if (!result) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete cart item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/increment')
  @ApiOperation({ summary: 'Increment the counter of a cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The counter has been successfully incremented.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  async incrementCounter(@Param('id') id: string) {
    try {
      const result = await this.cartItemService.incrementCounter(id);
      if (!result) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to increment counter',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/decrement')
  @ApiOperation({ summary: 'Decrement the counter of a cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The counter has been successfully decremented.',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the cart item' })
  async decrementCounter(@Param('id') id: string) {
    try {
      const result = await this.cartItemService.decrementCounter(id);
      if (!result) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to decrement counter',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
