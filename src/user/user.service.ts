import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Address } from '../address/entities/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { cart = [], wishlist = [] } = createUserDto;
    const user = this.userRepository.create({
      ...createUserDto,
      cart,
      wishlist,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['cart', 'wishlist', 'addresses', 'orders'] });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ['cart', 'wishlist', 'addresses', 'orders'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async addToCart(userId: string, productId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['cart'] });
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    user.cart.push(product);
    return this.userRepository.save(user);
  }

  async checkOut(userId: string): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'addresses'],
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Fetch the first address (assuming there is at least one address)
    const address = user.addresses[0];
  
    if (!address) {
      throw new NotFoundException(`No addresses found for User with ID ${userId}`);
    }
  
    // Check if all products are in stock
    const products = user.cart;
    const outOfStockProducts = products.filter(product => product.stock <= 0);
  
    if (outOfStockProducts.length > 0) {
      throw new BadRequestException('Some products are out of stock');
    }
  
    // Create the order
    const totalCost = products.reduce((sum, product) => sum + Number(product.price), 0);
    const order = this.orderRepository.create({
      user,
      products,
      cost: totalCost,
      status: 'Pending',
    });
  
    // Save the order
    await this.orderRepository.save(order);
  
    // Decrease the stock for each product
    for (const product of products) {
      product.stock -= 1;
      await this.productRepository.save(product);
    }
  
    // Clear the cart
    user.cart = [];
    await this.userRepository.save(user);
  
    return order;
  }

  async getCartProducts(userId: string): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'],  // Load the cart relation
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.cart;  // Return the products in the cart
  }
}
