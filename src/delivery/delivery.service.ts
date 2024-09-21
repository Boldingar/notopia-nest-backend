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

  async create(createDeliveryDto: CreateDeliveryDto) {
    // Create the delivery object first
    const newDelivery: Delivery = this.deliveryRepository.create({
      ...createDeliveryDto,
    });
    return this.deliveryRepository.save(newDelivery);
  }

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepository.find({ relations: ['currentOrder'] });
  }

  async findPendingOrders(): Promise<Order[]> {
    return this.orderRepository.find({ where: { status: 'Pending' } });
  }
  
  async findDeliveringOrders(): Promise<Order[]> {
    return this.orderRepository.find({ where: { status: 'Delivering' } });
  }

  findOne(id: string) {
    return `This action returns a #${id} delivery`;
  }

  async assignToOrder(
    deliveryManId: string,
    orderId: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryManId },
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

    order.deliveryId = delivery.id;
    order.status = 'Delivering';

    delivery.currentOrder = order;
    delivery.dateOfAssignment = new Date();

    await this.orderRepository.save(order);

    await this.deliveryRepository.save(delivery);

    return delivery;
  }

  async orderDelivered(
    deliveryManId: string,
    orderId: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryManId },
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

    delivery.dateOfDelivered = new Date();

    order.status = 'Delivered';
    order.deliveredAt = delivery.dateOfDelivered;

    delivery.currentOrder = null;
    delivery.dateOfAssignment = null;
    delivery.dateOfDelivered = null;

    await this.orderRepository.save(order);

    await this.deliveryRepository.save(delivery);

    return delivery;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
