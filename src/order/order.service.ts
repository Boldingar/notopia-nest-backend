import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, productIds, price, status } = createOrderDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['orders'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const products = await this.productRepository.findBy({
      id: In(productIds),
    });
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const order = this.orderRepository.create({
      ...createOrderDto,
    });

    const savedOrder = await this.orderRepository.save(order);

    user.orders = user.orders || [];

    user.orders = [...user.orders, savedOrder];
    await this.userRepository.save(user);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'products'] });
  }

  async findDelivered(): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: 'Delivered' },
      relations: ['user', 'products'],
    });
  }

  async findPending(): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: 'Pending' },
      relations: ['user', 'products'],
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { userId, productIds, price, status } = updateOrderDto;

    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (order.user) {
        const previousUser = await this.userRepository.findOneBy({
          id: order.user.id,
        });
        if (previousUser) {
          previousUser.orders = previousUser.orders.filter((o) => o.id !== id);
          await this.userRepository.save(previousUser);
        }
      }

      user.orders = [...user.orders, order];
      await this.userRepository.save(user);

      order.user = user;
    }

    if (productIds) {
      const products = await this.productRepository.findBy({
        id: In(productIds),
      });
      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }
      order.products = products;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async findOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User with ID ${userId} isnot found');
      }

      const orders = await this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!orders.length) {
        throw new NotFoundException('No orders are found for this user');
      }

      return orders;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find addresses');
    }
  }
}
