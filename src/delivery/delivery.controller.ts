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
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from 'src/order/entities/order.entity';
import { Delivery } from './entities/delivery.entity';

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiOperation({ summary: 'Creates a new delivery object' })
  @ApiResponse({ status: 201, description: 'The Delivery has been successfully created.', type: Delivery })
  @ApiResponse({ status: 200, description: 'Creation successed' })
  @ApiResponse({ status: 404, description: 'Creation failed' })
  @ApiBody({ type: CreateDeliveryDto })
  @Post()
  async create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  // get all orders with status "InProgress" to display them to the admin
  @ApiOperation({ summary: 'Get all orders in progress' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @ApiResponse({ status: 404, description: 'Deliveries not found' })
  @Get('InProgress')
  async getInProgressOrders(): Promise<Order[]> {
    return this.deliveryService.findInProgressOrders();
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

  @Patch(':id')
  updateOrderStatus(
    @Param('id') id: string,
    @Param('id') orderId: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto, // Accept status in the body
  ) {
    return this.deliveryService.updateOrderStatusForDelivery(id, orderId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }
}
