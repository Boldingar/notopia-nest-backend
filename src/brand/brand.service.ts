import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      const { brandName, brandImgUrl } = createBrandDto;

      const brand = this.brandRepository.create({
        brandName,
        brandImgUrl,
        products: [],
      });

      return await this.brandRepository.save(brand);
    } catch (error) {
      console.error('Error creating brand:', error);
      throw new BadRequestException('Failed to create brand');
    }
  }

  async findBrand(): Promise<Brand[]> {
    try {
      return await this.brandRepository.find();
    } catch (error) {
      console.error('Error finding brands:', error);
      throw new InternalServerErrorException('Failed to find brands');
    }
  }

  async findAll(): Promise<Brand[]> {
    try {
      return await this.brandRepository.find({ relations: ['products'] });
    } catch (error) {
      console.error('Error finding all brands:', error);
      throw new InternalServerErrorException('Failed to find all brands');
    }
  }

  async findOne(id: string): Promise<Brand> {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!brand) {
        throw new NotFoundException(`Brand with id ${id} not found`);
      }

      return brand;
    } catch (error) {
      console.error('Error finding brand:', error);
      throw new InternalServerErrorException('Failed to find brand');
    }
  }

  async findProducts(id: string): Promise<any[]> {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!brand) {
        throw new NotFoundException(`Brand with ID ${id} not found`);
      }

      return brand.products;
    } catch (error) {
      console.error('Error finding products:', error);
      throw new InternalServerErrorException('Failed to find products');
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    try {
      const brand = await this.brandRepository.preload({
        id,
        ...updateBrandDto,
      });

      if (!brand) {
        throw new NotFoundException(`Brand with id ${id} not found`);
      }

      return await this.brandRepository.save(brand);
    } catch (error) {
      console.error('Error updating brand:', error);
      throw new InternalServerErrorException('Failed to update brand');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.brandRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Brand with id ${id} not found`);
      }
      return result;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw new InternalServerErrorException('Failed to delete brand');
    }
  }

  async findTopSellingCategories(): Promise<
    { brandName: string; totalSales: number }[]
  > {
    try {
      const brands = await this.brandRepository.find();

      const brandsWithSales = await Promise.all(
        brands.map(async (brand) => {
          const totalSales = await this.productRepository
            .createQueryBuilder('product')
            .innerJoin('product.brand', 'brand')
            .where('brand.id = :brandId', { brandId: brand.id })
            .select('SUM(product.numberOfSales)', 'totalSales')
            .getRawOne();

          return {
            brandName: brand.brandName,
            totalSales:
              totalSales && totalSales.totalSales
                ? parseInt(totalSales.totalSales, 10)
                : 0,
          };
        }),
      );

      return brandsWithSales;
    } catch (error) {
      console.error('Error finding top-selling categories:', error);
      throw new InternalServerErrorException(
        'Failed to find top-selling categories',
      );
    }
  }
}
