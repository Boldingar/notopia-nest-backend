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
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from 'src/order/entities/order.entity';
import { Delivery } from './entities/delivery.entity';

@ApiTags('Delivery')
@ApiBearerAuth('Bearer')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiOperation({ summary: 'Creates a new delivery' })
  @ApiResponse({
    status: 201,
    description: 'Delivery has been successfully created.',
    type: Delivery,
  })
  @ApiResponse({ status: 400, description: 'Creation failed' })
  @ApiBody({ type: CreateDeliveryDto })
  @Post()
  async create(@Body() createDeliveryDto: CreateDeliveryDto) {
    try {
      return await this.deliveryService.create(createDeliveryDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create delivery',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Get orders by status' })
  @ApiParam({
    name: 'status',
    enum: ['ordered', 'in progress', 'picked up', 'delivered'],
    required: true,
  })
  @ApiResponse({ status: 200, description: 'List of orders by status' })
  @ApiResponse({
    status: 404,
    description: 'No orders found for the given status',
  })
  @Get(':status')
  async getOrdersByStatus(@Param('status') status: string): Promise<Order[]> {
    try {
      return await this.deliveryService.getOrdersByStatus(status);
    } catch (error) {
      throw new HttpException(
        'Failed to get orders by status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get details of a specific delivery' })
  @ApiResponse({ status: 200, description: 'Delivery details' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the delivery' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Delivery> {
    try {
      const delivery = await this.deliveryService.findOne(id);
      if (!delivery) {
        throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
      }
      return delivery;
    } catch (error) {
      throw new HttpException(
        'Failed to get delivery',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiResponse({ status: 200, description: 'List of all deliveries' })
  @ApiResponse({ status: 404, description: 'No deliveries found' })
  @Get()
  async findAll(): Promise<Delivery[]> {
    try {
      return await this.deliveryService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get deliveries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Change status of an order' })
  @ApiResponse({ status: 200, description: 'Status changed successfully' })
  @ApiResponse({ status: 404, description: 'Order or delivery not found' })
  @ApiParam({
    name: 'deliveryId',
    type: String,
    description: 'ID of the delivery',
  })
  @ApiParam({ name: 'orderId', type: String, description: 'ID of the order' })
  @Patch(':deliveryId/order/:orderId')
  async changeOrderStatus(
    @Param('deliveryId') deliveryId: string,
    @Param('orderId') orderId: string,
  ): Promise<Delivery> {
    try {
      return await this.deliveryService.changeOrderStatus(deliveryId, orderId);
    } catch (error) {
      throw new HttpException(
        'Failed to change order status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Delete a delivery' })
  @ApiResponse({ status: 200, description: 'Delivery successfully deleted' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the delivery to be deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.deliveryService.remove(+id);
      if (!result) {
        throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete delivery',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
