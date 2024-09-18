import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { categoryName, categoryImgUrl } = createCategoryDto;
    
    // Create a new instance of Category entity
    const category = this.categoryRepository.create({
      categoryName,
      categoryImgUrl,
      products: [],
    });

    // Save the category to the database
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async findCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id }, relations: ['products'] });
  }

  async findProducts(id: string): Promise<any[]> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Return only the products, not the category itself
    return category.products;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async findTopSellingCategories(): Promise<{ categoryName: string; totalSales: number }[]> {
    const categories = await this.categoryRepository.find();
  
    const categoriesWithSales = await Promise.all(
      categories.map(async (category) => {
        const totalSales = await this.productRepository
          .createQueryBuilder('product')
          .where('product.categoryId = :categoryId', { categoryId: category.id })
          .select('SUM(product.numberOfSales)', 'totalSales')
          .getRawOne();
  
          return {
            categoryName: category.categoryName,
            totalSales: parseInt(totalSales.totalSales, 10) || 0, 
          };
      }),
    );
  
    categoriesWithSales.sort((a, b) => b.totalSales - a.totalSales);
  
    return categoriesWithSales;
  }
}
