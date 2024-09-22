import { CartItem } from './entities/cart-item.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const { product: productId, user: userId } = createCartItemDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'],
    });

    if (!product || !user) {
      throw new NotFoundException('Product or User not found');
    }

    let cartItem = user.cart.find((item) => item.product.id === productId);

    if (cartItem) {
      // Mark the field to be updated explicitly
      cartItem.counter += 1;
    } else {
      cartItem = new CartItem();
      cartItem.product = product;
      cartItem.user = user;
      cartItem.counter = 1;
      user.cart.push(cartItem);
    }

    // Save will either insert or update the entity
    await this.cartItemRepository.save(cartItem);
    await this.userRepository.save(user);

    return await this.cartItemRepository.save(cartItem);;
  }

  findAll() {
    return this.cartItemRepository.find();
  }

  findOne(id: string) {
    return this.cartItemRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    Object.assign(cartItem, updateCartItemDto);
    return this.cartItemRepository.save(cartItem);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cartItemRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
  }

  async incrementCounter(id: string): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    cartItem.counter++;
    return this.cartItemRepository.save(cartItem);
  }

  async decrementCounter(id: string): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    cartItem.counter--;
    return this.cartItemRepository.save(cartItem);
  }
}
