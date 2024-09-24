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

  findAll() {
    return this.cartItemRepository.find();
  }

  findOne(id: string) {
    return this.cartItemRepository.findOne({ where: { id } });
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
