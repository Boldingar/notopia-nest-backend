import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const {
        categoryIds,
        images,
        linkedProducts,
        ...productData
      } = createProductDto;

      // Fetch the categories
      const categories = await this.categoryRepository.findByIds(categoryIds);

      if (categoryIds.length !== categories.length) {
        throw new NotFoundException('One or more categories not found');
      }

      // Fetch the linked products
      const linkedProductEntities = linkedProducts
        ? await this.productRepository.findByIds(linkedProducts)
        : [];

      // Create the product
      const product = this.productRepository.create({
        ...productData,
        categories, // Set categories
        images,
        linkedProducts: linkedProductEntities, // Set linked products
      });

      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException('Failed to create product');
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['categories', 'linkedProducts'], // Include relationships
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'linkedProducts'], // Include relationships
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const {
      categoryIds,
      images,
      linkedProducts,
      ...updateData
    } = updateProductDto;

    // Find the existing product
    const product = await this.productRepository.preload({
      id,
      ...updateData,
      images,
      linkedProducts: linkedProducts
        ? await this.productRepository.findByIds(linkedProducts)
        : [],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Update categories if provided
    if (categoryIds) {
      const categories = await this.categoryRepository.findByIds(categoryIds);

      if (categoryIds.length !== categories.length) {
        throw new NotFoundException('One or more categories not found');
      }

      product.categories = categories;
    }

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findTopSellingProducts(): Promise<{ productName: string; numberOfSales: number }[]> {
    const products = await this.productRepository.find();

    const sortedProducts = products.sort((a, b) => b.numberOfSales - a.numberOfSales);

    return sortedProducts.map((product) => ({
      productName: product.name,
      numberOfSales: product.numberOfSales || 0,
    }));
  }

  async searchProductsByName(name: string): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where: { name: ILike(`%${name}%`) },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to search products');
    }
  }
}
