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

  @ApiOperation({ summary: 'Creates a new delivery object' })
  @ApiResponse({
    status: 201,
    description: 'The Delivery has been successfully created.',
    type: Delivery,
  })
  @ApiResponse({ status: 200, description: 'Creation successed' })
  @ApiResponse({ status: 404, description: 'Creation failed' })
  @ApiBody({ type: CreateDeliveryDto })
  @Post()
  async create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  // get all orders with status "InProgress" to display them to the admin
  @ApiOperation({ summary: 'Get Pending orders' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @ApiResponse({ status: 404, description: 'Deliveries not found' })
  @Get('pending')
  async getPendingOrders(): Promise<Order[]> {
    return this.deliveryService.findPendingOrders();
  }

  @ApiOperation({ summary: 'Get Dilevering orders' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @ApiResponse({ status: 404, description: 'Deliveries not found' })
  @Get('dilevering')
  async getDeilveringOrders(): Promise<Order[]> {
    return this.deliveryService.findDeliveringOrders();
  }

  @ApiOperation({ summary: 'Get an order' })
  @ApiResponse({ status: 200, description: 'Get an order' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the delivery' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @ApiOperation({ summary: 'Gets all delivery objects' })
  @Get()
  findAll() {
    return this.deliveryService.findAll();
  }

  @ApiOperation({ summary: 'Assign driver to order' })
  @ApiResponse({ status: 200, description: 'Order assigned' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  @ApiParam({
    name: 'deliveryId',
    type: String,
    description: 'ID of the delivery',
  })
  @ApiParam({ name: 'orderId', type: String, description: 'ID of the Order' })
  @Patch('delivery/:deliveryId/order/:orderId')
  assignToOrder(
    @Param('deliveryId') deliveryId: string,
    @Param('orderId') orderId: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveryService.assignToOrder(deliveryId, orderId);
  }

  @ApiOperation({ summary: 'change status of order to delivered' })
  @ApiResponse({ status: 200, description: 'Order assigned' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  @ApiParam({
    name: 'deliveryId',
    type: String,
    description: 'ID of the delivery',
  })
  @ApiParam({ name: 'orderId', type: String, description: 'ID of the Order' })
  @Patch('delivered/delivery/:deliveryId/order/:orderId')
  orderDelivered(
    @Param('deliveryId') deliveryId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.deliveryService.orderDelivered(deliveryId, orderId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }
}
