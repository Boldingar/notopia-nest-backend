import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findInProgressOrders(): Promise<Order[]> {
    return this.orderRepository.find({ where: { status: 'InProgress' } });
  }

  create(createDeliveryDto: CreateDeliveryDto) {
    return 'This action adds a new delivery';
  }

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  async updateOrderStatusForDelivery(
    deliveryManId: string, // ID of the delivery man
    orderId: string, // The order object passed as a parameter
  ): Promise<Delivery> {
    // Find the delivery associated with the delivery man
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryManId },
      relations: ['cart'],
    });

    if (!delivery) {
      throw new NotFoundException(
        `Delivery for delivery man with ID ${deliveryManId} not found`,
      );
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    // Update the status of the passed order to 'Delivering'
    order.status = 'Delivering';

    // Set the current order in the delivery object
    delivery.currentOrder = order;

    // Save the updated order entity with the new status
    await this.orderRepository.save(order);

    // Save the updated delivery entity with the updated order
    await this.deliveryRepository.save(delivery);

    // Return the updated delivery entity
    return delivery;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
