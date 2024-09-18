import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const { categoryId, ...productData } = createProductDto;

    // Find the category associated with the product
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Create a new product instance
    const product = this.productRepository.create({
      ...productData,
      category,
    });

    // Save the product to the database
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { categoryId, ...updateData } = updateProductDto;

    // Find the existing product
    const product = await this.productRepository.preload({
      id,
      ...updateData,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // If a new category is provided, find it and update the product's category
    if (categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      product.category = category;
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
}
