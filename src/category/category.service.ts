import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const { categoryName, categoryImgUrl } = createCategoryDto;

      const category = this.categoryRepository.create({
        categoryName,
        categoryImgUrl,
        products: [],
      });

      return this.categoryRepository.save(category);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new BadRequestException('Failed to create category');
    }
  }
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async findCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  async findProducts(id: string): Promise<any[]> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category.products;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
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
    try {

      const result = await this.categoryRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new InternalServerErrorException('Failed to delete category');
    }
  }

  async findTopSellingCategories(): Promise<
    { categoryName: string; totalSales: number }[]
  > {
    const categories = await this.categoryRepository.find();

    const categoriesWithSales = await Promise.all(
      categories.map(async (category) => {
        const totalSales = await this.productRepository
          .createQueryBuilder('product')
          .innerJoin('product.categories', 'category')
          .where('category.id = :categoryId', { categoryId: category.id })
          .select('SUM(product.numberOfSales)', 'totalSales')
          .getRawOne();

        return {
          categoryName: category.categoryName,
          totalSales: parseInt(totalSales.totalSales, 10) || 0,
        };
      }),
    );

    return categoriesWithSales;
  }
}
