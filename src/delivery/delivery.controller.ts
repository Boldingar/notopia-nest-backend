import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from 'src/order/entities/order.entity';
import { Delivery } from './entities/delivery.entity';

@ApiTags('Delivery')
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
    return this.deliveryService.create(createDeliveryDto);
  }

 @ApiOperation({ summary: 'Get orders by status' })
  @ApiParam({ name: 'status', enum: ['ordered', 'in progress', 'picked up', 'delivered'], required: true })
  @ApiResponse({ status: 200, description: 'List of orders by status' })
  @ApiResponse({ status: 404, description: 'No orders found for the given status' })
  @Get(':status')
  async getOrdersByStatus(@Param('status') status: string): Promise<Order[]> {
    return this.deliveryService.getOrdersByStatus(status);
  }


  @ApiOperation({ summary: 'Get details of a specific delivery' })
  @ApiResponse({ status: 200, description: 'Delivery details' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the delivery' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Delivery> {
    return this.deliveryService.findOne(id);
  }

  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiResponse({ status: 200, description: 'List of all deliveries' })
  @ApiResponse({ status: 404, description: 'No deliveries found' })
  @Get()
  async findAll(): Promise<Delivery[]> {
    return this.deliveryService.findAll();
  }

  @ApiOperation({ summary: 'change status to an order' })
  @ApiResponse({ status: 200, description: 'status changes successfully' })
  @ApiResponse({ status: 404, description: 'Order or delivery not found' })
  @ApiParam({
    name: 'deliveryId',
    type: String,
    description: 'ID of the delivery',
  })
  @ApiParam({ name: 'orderId', type: String, description: 'ID of the order' })
  @Patch(':deliveryId/order/:orderId')
  async changeOrderStatud(
    @Param('deliveryId') deliveryId: string,
    @Param('orderId') orderId: string,
  ): Promise<Delivery> {
    return this.deliveryService.changeOrderStatus(deliveryId, orderId);
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
    return this.deliveryService.remove(+id);
  }
}
