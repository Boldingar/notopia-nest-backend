import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { userId, productIds, cost, status } = createOrderDto;
  
    // Find the user associated with the order and include the 'orders' relation
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['orders'],  // Ensure the orders relation is fetched
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Find the products associated with the order
    const products = await this.productRepository.findBy({
      id: In(productIds),
    });
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }
  
    // Create a new order instance
    const order = this.orderRepository.create({
      user,
      products,
      cost,
      status,
      date: new Date(), // Set the date to the current time
    });
  
    // Save the order to the database
    const savedOrder = await this.orderRepository.save(order);
  
    // Ensure user.orders is an array, even if it was undefined
    user.orders = user.orders || [];
  
    // Update the user's orders array
    user.orders = [...user.orders, savedOrder];
    await this.userRepository.save(user);
  
    return savedOrder;
  }
  

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'products'] });
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
    const { userId, productIds, cost, status } = updateOrderDto;

    // Find the existing order
    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // If a new user is provided, update the user's orders array
    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Update the previous user's orders array to remove the order
      if (order.user) {
        const previousUser = await this.userRepository.findOneBy({ id: order.user.id });
        if (previousUser) {
          previousUser.orders = previousUser.orders.filter(o => o.id !== id);
          await this.userRepository.save(previousUser);
        }
      }

      // Update the current user's orders array
      user.orders = [...user.orders, order];
      await this.userRepository.save(user);

      order.user = user;
    }

    // If new products are provided, update the order's products
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
}
