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
    const newDelivery: Delivery = this.deliveryRepository.create({
      ...createDeliveryDto,
    });
    return this.deliveryRepository.save(newDelivery);
  }

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepository.find({ relations: ['currentOrders'] });
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return this.orderRepository.find({ where: { status } });
  }

  async findOne(id: string): Promise<Delivery> {
    return this.deliveryRepository.findOne({ where: { id } });
  }

  async changeOrderStatus(
    deliveryManId: string,
    orderId: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryManId },
      relations: ['currentOrders'],
    });
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!delivery) {
      throw new NotFoundException(
        `Delivery for delivery man with ID ${deliveryManId} not found`,
      );
    }

    let status: string;
    if (delivery.role === 'stockMan') {
      status = 'in progress';
    } else if (delivery.role === 'deliveryMan') {
      if (!delivery.currentOrders) {
        delivery.currentOrders = [];
      }

      const existingOrderIndex = delivery.currentOrders.findIndex(
        (o) => o.id === orderId,
      );

      if (existingOrderIndex === -1) {
        status = 'picked up';
        delivery.currentOrders.push(order);
        delivery.dateOfAssignment = new Date();
      } else {
        status = 'delivered';
        delivery.currentOrders.splice(existingOrderIndex, 1);
        order.deliveredAt = new Date();
      }
    }

    order.deliveryId = delivery.id;
    order.status = status;

    await this.orderRepository.save(order);
    await this.deliveryRepository.save(delivery);

    return delivery;
  }

  async remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
