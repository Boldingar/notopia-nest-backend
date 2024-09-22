import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Address } from '../address/entities/address.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

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
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
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
    return this.userRepository.find({
      relations: ['cart', 'wishlist', 'addresses', 'orders'],
    });
  }

  async findOneByPhone(phone: string): Promise<User> {
    return this.userRepository.findOne({
      where: { phone },
      relations: ['cart', 'wishlist', 'addresses', 'orders'],
    });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['cart', 'wishlist', 'addresses', 'orders'],
    });
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

  async addToCart(
    userId: string,
    productId: string,
  ): Promise<{ cart: CartItem[]; totalPrice: number }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.product'],
    });
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

    let cartItem = user.cart.find((item) => item.product.id === productId);
    if (cartItem) {
      cartItem.counter += 1;
    } else {
      cartItem = new CartItem();
      cartItem.counter = 1;
      user.cart.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    await this.userRepository.save(user);

    const totalPrice = user.cart.reduce((sum, item) => {
      const discount = item.product.discountPercentage || 0;
      const effectivePrice =
        discount > 0
          ? item.product.price - item.product.price * (discount / 100)
          : item.product.price;

      return sum + effectivePrice * item.counter;
    }, 0);

    return { cart: user.cart, totalPrice };
  }
  
  // async addToCart(userId: string, productId: string): Promise<CartItem[]> {
  // const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['cart', 'cart.product'],
  //   });
  //   const product = await this.productRepository.findOneBy({ id: productId });

  //   if (!product) {
  //     throw new NotFoundException('Product not found');
  //   }

  //   // Check if the product is already in the cart
  //   const existingCartItem = user.cart.find(
  //     (item) => item.product.id === productId,
  //   );

  //   if (existingCartItem) {
  //     // If the item exists, increment the quantity by 1
  //     existingCartItem.counter += 1;
  //   } else {
  //     // If it doesn't exist, create a new CartItem with a counter of 1
  //     const newCartItem = new CartItem();
  //     newCartItem.user = user;
  //     newCartItem.product = product;
  //     newCartItem.counter = 1; // Set initial counter to 1

  //     user.cart.push(newCartItem);
  //   }

  //   await this.userRepository.save(user);
  //   return user.cart;
  // }

  async checkOut(
    userId: string,
    addressIndex: number,
    voucherName?: string,
  ): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.product', 'addresses'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const numberOfAddresses = user.addresses.length;

    if (addressIndex < 1 || addressIndex > numberOfAddresses) {
      throw new BadRequestException(
        `Invalid address index. User has ${numberOfAddresses} address(es).`,
      );
    }

    const address = user.addresses[addressIndex - 1];

    if (!address) {
      throw new NotFoundException(
        `No address found at index ${addressIndex} for User with ID ${userId}`,
      );
    }

    const cartItems = user.cart;
    const outOfStockProducts = cartItems.filter(
      (item) => item.product.stock <= 0,
    );

    if (outOfStockProducts.length > 0) {
      throw new BadRequestException('Some products are out of stock');
    }

    var totalPrice = user.cart.reduce((sum, item) => {
      const discount = item.product.discountPercentage || 0;
      const effectivePrice =
        discount > 0
          ? item.product.price - item.product.price * (discount / 100)
          : item.product.price;

      return sum + effectivePrice * item.counter;
    }, 0);

    if (voucherName) {
      const voucher = await this.voucherRepository.findOne({
        where: { name: voucherName },
      });

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
      products: cartItems.map((item) => item.product),
      price: totalPrice,
      status: 'Pending',
    });

    await this.orderRepository.save(order);

    for (const item of cartItems) {
      item.product.stock -= item.counter;
      await this.productRepository.save(item.product);
    }

    return order;
  }

  async getCartProducts(
    userId: string,
  ): Promise<{ cart: CartItem[]; totalPrice: number }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.product'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const totalPrice = user.cart.reduce((sum, item) => {
      const discount = item.product.discountPercentage || 0;
      const effectivePrice =
        discount > 0
          ? item.product.price - item.product.price * (discount / 100)
          : item.product.price;

      return sum + effectivePrice * item.counter;
    }, 0);
    return { cart: user.cart, totalPrice };
  }

  async getTotalCustomers(): Promise<number> {
    return this.userRepository.count({ where: { flag: 'customer' } });
  }

  async getOrderedUsersPercentage(): Promise<{
    orderedUsersCount: number;
    totalCustomersCount: number;
  }> {
    const totalCustomersCount = await this.getTotalCustomers();

    const orderedUsersCount = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.orders', 'order')
      .where('user.flag = :flag', { flag: 'customer' })
      .getCount();

    return { orderedUsersCount, totalCustomersCount };
  }
}
