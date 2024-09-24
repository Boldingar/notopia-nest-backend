import { CartItem } from './entities/cart-item.entity';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async findAll() {
    try {
      return await this.cartItemRepository.find();
    } catch (error) {
      console.error('Error finding all cart items:', error);
      throw new InternalServerErrorException('Failed to find all cart items');
    }
  }

  async findOne(id: string) {
    try {
      const cartItem = await this.cartItemRepository.findOne({ where: { id } });
      if (!cartItem) {
        throw new NotFoundException(`Cart item with ID ${id} not found`);
      }
      return cartItem;
    } catch (error) {
      console.error('Error finding cart item:', error);
      throw new InternalServerErrorException('Failed to find cart item');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.cartItemRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Cart item with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw new InternalServerErrorException('Failed to delete cart item');
    }
  }

  async incrementCounter(id: string): Promise<CartItem> {
    try {
      const cartItem = await this.cartItemRepository.findOne({ where: { id } });
      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }
      cartItem.counter++;
      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      console.error('Error incrementing counter:', error);
      throw new InternalServerErrorException('Failed to increment counter');
    }
  }

  async decrementCounter(id: string): Promise<CartItem> {
    try {
      const cartItem = await this.cartItemRepository.findOne({ where: { id } });
      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }
      cartItem.counter--;
      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      console.error('Error decrementing counter:', error);
      throw new InternalServerErrorException('Failed to decrement counter');
    }
  }
}
