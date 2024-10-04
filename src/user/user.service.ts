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
import * as bcrypt from 'bcrypt';

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
    const { password } = createUserDto;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['cart', 'wishlist', 'addresses', 'orders'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findUserByPhone(phone: string): Promise<User> {
    return this.userRepository.findOne({
      where: { phone },
      relations: ['cart', 'wishlist', 'addresses', 'orders'],
    });
  }
  
  async getWishlist(phone: string): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ['wishlist'], // Load the wishlist relation
    });
  
    if (!user) {
      throw new NotFoundException(`User with phone number ${phone} not found`);
    }
  
    return user.wishlist; // Return the wishlist
  }

  async update(phone: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new NotFoundException(`User with phone number ${phone} not found`);
    }

    for (const key in updateUserDto) {
      if (updateUserDto[key] !== undefined) {
        user[key] = updateUserDto[key];
      }
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id, isDeleted: false } });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found or already deleted`);
    }
  
    user.isDeleted = true;
    await this.userRepository.save(user);  // Mark the user as deleted
  }
  
  async emptyCart(userId: string): Promise<{ message: string; user: User }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.cart = [];

    await this.userRepository.save(user);

    return {
      message: 'the cart items has been deleted successfully',
      user: user,
    };
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

    let cartItem = user.cart.find((item) => item?.product?.id === productId);
    if (cartItem) {
      cartItem.counter += 1;
    } else {
      cartItem = new CartItem();
      cartItem.counter = 1;
      cartItem.product = product;
      user.cart.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    await this.userRepository.save(user);

    const totalPrice = user.cart.reduce((sum, item) => {
      if (!item.product) return sum;
      const discount = Number(item.product.discountPercentage) || 0;
      const effectivePrice =
        discount > 0
          ? item.product.price - item.product.price * (discount / 100)
          : item.product.price;

      return sum + effectivePrice * item.counter;
    }, 0);

    return { cart: user.cart, totalPrice };
  }

  async removeFromCart(
    userId: string,
    productId: string,
  ): Promise<{ message: string; cart: CartItem[]; totalPrice: number }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.product'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.id === productId,
    );

    if (cartItemIndex === -1) {
      throw new NotFoundException(
        `Product with ID ${productId} not found in the cart`,
      );
    }

    user.cart.splice(cartItemIndex, 1);

    await this.userRepository.save(user);

    const totalPrice = user.cart.reduce((sum, item) => {
      if (!item.product) return sum;
      const discount = Number(item.product.discountPercentage) || 0;
      const effectivePrice =
        discount > 0
          ? item.product.price - item.product.price * (discount / 100)
          : item.product.price;

      return sum + effectivePrice * item.counter;
    }, 0);

    return {
      message: `Product with ID ${productId} has been removed from the cart successfully`,
      cart: user.cart,
      totalPrice,
    };
  }

  async checkOut(
    userId: string,
    addressIndex: number,
    voucherName?: string,
    scheduleDelivery?: Date,
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
      products: cartItems,
      price: totalPrice,
      status: 'ordered',
      scheduleDelivery: scheduleDelivery
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

  async getAllVouchers(userId: string): Promise<Voucher[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vouchers'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.vouchers;
  }

  async addVoucher(userId: string, voucherId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vouchers'],
    });
    const voucher = await this.voucherRepository.findOne({
      where: { id: voucherId },
    });
    if (!user || !voucher) {
      throw new Error('User or Voucher not found');
    }

    user.vouchers.push(voucher);
    return this.userRepository.save(user);
  }

  async removeVoucher(userId: string, voucherId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['vouchers'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.vouchers = user.vouchers.filter((voucher) => voucher.id !== voucherId);
    return this.userRepository.save(user);
  }

  async addToWishlist(phone: string, productId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ['wishlist'],
    });

    if (!user) {
      throw new NotFoundException(`User with phone number ${phone} not found`);
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const isProductInWishlist = user.wishlist.some(
      (wishlistProduct) => wishlistProduct.id === productId,
    );

    if (isProductInWishlist) {
      throw new BadRequestException(
        `Product with ID ${productId} is already in the wishlist`,
      );
    }

    user.wishlist.push(product);

    await this.userRepository.save(user);

    return user;
  }

  async removeFromWishlist(phone: string, productId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ['wishlist'], // Ensure the wishlist relation is loaded
    });

    if (!user) {
      throw new NotFoundException(`User with phone number ${phone} not found`);
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const productIndex = user.wishlist.findIndex(
      (wishlistItem) => wishlistItem.id === productId,
    );

    if (productIndex === -1) {
      throw new BadRequestException(
        `Product with ID ${productId} is not in the wishlist`,
      );
    }

    user.wishlist.splice(productIndex, 1);

    await this.userRepository.save(user);

    return user;
  }
}
