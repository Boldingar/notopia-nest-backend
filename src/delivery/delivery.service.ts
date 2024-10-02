import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      const { password } = createDeliveryDto;

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newDelivery: Delivery = this.deliveryRepository.create({
        ...createDeliveryDto,
        password: hashedPassword,
      });
      return await this.deliveryRepository.save(newDelivery);
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw new InternalServerErrorException('Failed to create delivery');
    }
  }

  async findAll(): Promise<Delivery[]> {
    try {
      return await this.deliveryRepository.find({
        relations: ['currentOrders'],
      });
    } catch (error) {
      console.error('Error finding all deliveries:', error);
      throw new InternalServerErrorException('Failed to find all deliveries');
    }
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    try {
      return await this.orderRepository.find({ where: { status } });
    } catch (error) {
      console.error('Error finding orders by status:', error);
      throw new InternalServerErrorException('Failed to find orders by status');
    }
  }

  async findOne(id: string): Promise<Delivery> {
    try {
      const delivery = await this.deliveryRepository.findOne({ where: { id } });
      if (!delivery) {
        throw new NotFoundException(`Delivery with ID ${id} not found`);
      }
      return delivery;
    } catch (error) {
      console.error('Error finding delivery:', error);
      throw new InternalServerErrorException('Failed to find delivery');
    }
  }

  async changeOrderStatus(
    deliveryManId: string,
    orderId: string,
  ): Promise<Delivery> {
    try {
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
      if (delivery.flag === 'stock') {
        status = 'in progress';
      } else if (delivery.flag === 'delivery') {
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
    } catch (error) {
      console.error('Error changing order status:', error);
      throw new InternalServerErrorException('Failed to change order status');
    }
  }

  async remove(id: string) {
    const delivery = await this.deliveryRepository.findOne({ where: { id, isDeleted: false } });

  if (!delivery) {
    throw new NotFoundException(`User with ID ${id} not found or already deleted`);
  }

  delivery.isDeleted = true;
  await this.deliveryRepository.save(delivery);  // Mark the user as deleted
  }
}
