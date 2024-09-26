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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@ApiTags('order')
@ApiBearerAuth('Bearer')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  @ApiBody({ type: CreateOrderDto })
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (error) {
      throw new HttpException('Failed to create order', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @Get()
  async findAll() {
    try {
      return await this.orderService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get all delivered orders' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @Get('delivered')
  async findDelivered() {
    try {
      return await this.orderService.findDelivered();
    } catch (error) {
      throw new HttpException(
        'Failed to get delivered orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get all pending orders' })
  @ApiResponse({ status: 200, description: 'List of all pending orders' })
  @Get('pending')
  async findPending() {
    try {
      return await this.orderService.findPending();
    } catch (error) {
      throw new HttpException(
        'Failed to get pending orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the order' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.orderService.findOne(id);
      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      return order;
    } catch (error) {
      throw new HttpException(
        'Failed to get order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the order' })
  @Patch(':id')
  @ApiBody({ type: UpdateOrderDto })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const updatedOrder = await this.orderService.update(id, updateOrderDto);
      if (!updatedOrder) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      return updatedOrder;
    } catch (error) {
      throw new HttpException(
        'Failed to update order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order has been deleted.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the order' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.orderService.remove(id);
      if (!result) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiResponse({ status: 200, description: 'List of orders', type: [Order] })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    description: 'User ID',
  })
  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string): Promise<Order[]> {
    try {
      return await this.orderService.findOrdersByUserId(userId);
    } catch (error) {
      throw new HttpException(
        'Failed to get orders by user ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
