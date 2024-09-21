import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

      return this.brandRepository.save(brand);
    } catch (error) {
      console.error('Error creating brand:', error);
      throw new BadRequestException('Failed to create brand');
    }
  }

  async findBrand(): Promise<Brand[]> {
    return this.brandRepository.find();
  }
  async findAll(): Promise<Brand[]> {
    return this.brandRepository.find({ relations: ['products'] });
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return brand;
  }

  async findProducts(id: string): Promise<any[]> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`brand with ID ${id} not found`);
    }

    return brand.products;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {


    const brand = await this.brandRepository.preload({
      id,
      ...updateBrandDto,
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return this.brandRepository.save(brand);
  }

  async remove(id: string): Promise<void> {
    const result = await this.brandRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
  }

  async findTopSellingCategories(): Promise<
  { brandName: string; totalSales: number }[]
> {
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
        totalSales: totalSales && totalSales.totalSales
          ? parseInt(totalSales.totalSales, 10)
          : 0,
      };
    }),
  );

  return brandsWithSales;
}

}
