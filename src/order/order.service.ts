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
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { userId, products, price, status, scheduleDelivery } = createOrderDto; // Include scheduleDelivery
  
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['orders'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      // Find cart items by their IDs
      const cartItems = await this.cartItemRepository.findBy({
        id: In(products),
      });
  
      // Check if all cart items are found
      if (cartItems.length !== products.length) {
        throw new NotFoundException('One or more cart items not found');
      }
  
      // Create the order and assign the found cart items to the products field
      const order = this.orderRepository.create({
        user,
        products: cartItems,
        price,
        status,
        scheduleDelivery, // Add this line
      });
  
      // Save the order
      const savedOrder = await this.orderRepository.save(order);
  
      // Add the saved order to the user's orders
      user.orders = [...(user.orders || []), savedOrder];
      await this.userRepository.save(user);
  
      return savedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Failed to create order');
    }
  }
  

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const { userId, products, price, status, scheduleDelivery } = updateOrderDto; // Include scheduleDelivery
  
      // Load the existing order by id
      const order = await this.orderRepository.preload({
        id,
        price,
        status,
        scheduleDelivery, // Add this line
      });
  
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
  
      // If userId is provided, update the user related to the order
      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['orders'],
        });
  
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
  
        // Remove the order from the previous user if necessary
        if (order.user && order.user.id !== userId) {
          const previousUser = await this.userRepository.findOne({
            where: { id: order.user.id },
            relations: ['orders'],
          });
  
          if (previousUser) {
            previousUser.orders = previousUser.orders.filter(
              (o) => o.id !== order.id,
            );
            await this.userRepository.save(previousUser);
          }
        }
  
        // Update the user associated with the order
        user.orders = [...(user.orders || []), order];
        await this.userRepository.save(user);
  
        order.user = user;
      }
  
      // If productIds are provided, update the cart items
      if (products) {
        const cartItems = await this.cartItemRepository.find({
          where: { id: In(products) },
          relations: ['product'],
        });
  
        if (cartItems.length !== products.length) {
          throw new NotFoundException('One or more cart items not found');
        }
  
        // Update the order's products (which are CartItems)
        order.products = cartItems;
      }
  
      // Save the updated order
      return await this.orderRepository.save(order);
    } catch (error) {
      console.error('Error updating order:', error);
      throw new InternalServerErrorException('Failed to update order');
    }
  }
  

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        relations: ['user', 'products'],
      });
    } catch (error) {
      console.error('Error finding all orders:', error);
      throw new InternalServerErrorException('Failed to find all orders');
    }
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { status },
        relations: ['user', 'products'],
      });
    } catch (error) {
      console.error('Error finding orders by status:', error);
      throw new InternalServerErrorException('Failed to find orders by status');
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['user', 'products'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      console.error('Error finding order:', error);
      throw new InternalServerErrorException('Failed to find order');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.orderRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new InternalServerErrorException('Failed to delete order');
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
