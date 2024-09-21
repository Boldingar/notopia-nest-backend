import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Address } from '../address/entities/address.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
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

  async addToCart(userId: string, productId: string): Promise<{ message: string, totalPrice: number }> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['cart'] });
    const product = await this.productRepository.findOneBy({ id: productId });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  
    if (product.stock <= 0) {
      throw new BadRequestException('Product is out of stock');
    }
  
    user.cart.push(product);
    await this.userRepository.save(user);
  
    const totalPrice = user.cart.reduce((sum, product) => {
      const discount = product.discountPercentage || 0;
      const effectivePrice = discount > 0
        ? product.price - (product.price * (discount / 100))
        : product.price;
  
      return sum + effectivePrice;
    }, 0);
  
    return { message: `Item added successfully`, totalPrice };
  }
  
  async checkOut(userId: string, addressIndex: number, voucherName?: string): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'addresses'],
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    const numberOfAddresses = user.addresses.length;
  
    if (addressIndex < 1 || addressIndex > numberOfAddresses) {
      throw new BadRequestException(`Invalid address index. User has ${numberOfAddresses} address(es).`);
    }
  
    const address = user.addresses[addressIndex - 1];
  
    if (!address) {
      throw new NotFoundException(`No address found at index ${addressIndex} for User with ID ${userId}`);
    }
  
    const products = user.cart;
    const outOfStockProducts = products.filter(product => product.stock <= 0);
  
    if (outOfStockProducts.length > 0) {
      throw new BadRequestException('Some products are out of stock');
    }
  
    let totalPrice = products.reduce((sum, product) => {
      const discount = product.discountPercentage || 0;
      const effectivePrice = discount > 0
        ? product.price - (product.price * (discount / 100))
        : product.price;
  
      return sum + effectivePrice;
    }, 0);
  
    if (voucherName) {
      const voucher = await this.voucherRepository.findOne({ where: { name: voucherName } });
  
      if (voucher) {
        if (voucher.discountPercentage) {
          totalPrice -= totalPrice * (voucher.discountPercentage / 100);
        } else if (voucher.discountValue) {
          totalPrice -= voucher.discountValue;
        }
      }
    }
  
    totalPrice = Math.max(totalPrice, 0);
  
    user.cart = [];
    await this.userRepository.save(user);
  
    const order = this.orderRepository.create({ 
      user,
      products,
      price: totalPrice, 
      status: 'Pending', 
    });
  
    await this.orderRepository.save(order);
  
    for (const product of products) {
      product.stock -= 1;
      await this.productRepository.save(product);
    }
  
    return order;
  }  
  
  async getCartProducts(userId: string): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'], 
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.cart;  
  }

  async getTotalCustomers(): Promise<number> {
    return this.userRepository.count({ where: { flag: 'customer' } });
  }

  async getOrderedUsersPercentage(): Promise<{ orderedUsersCount: number; totalCustomersCount: number }> {
    const totalCustomersCount = await this.getTotalCustomers();
  
    const orderedUsersCount = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.orders', 'order') 
      .where('user.flag = :flag', { flag: 'customer' })
      .getCount();
  
    return { orderedUsersCount, totalCustomersCount };
  }
  
}
