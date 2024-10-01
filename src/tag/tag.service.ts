import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const { name } = createTagDto;

      const tag = this.tagRepository.create({
        name,
        products: [],
      });

      return await this.tagRepository.save(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new BadRequestException('Failed to create tag');
    }
  }

  async findAll(): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({ relations: ['products'] });
    } catch (error) {
      console.error('Error finding all tags:', error);
      throw new InternalServerErrorException('Failed to find all tags');
    }
  }

  async findOne(id: string): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!tag) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }

      return tag;
    } catch (error) {
      console.error('Error finding tag:', error);
      throw new InternalServerErrorException('Failed to find tag');
    }
  }

  async findProducts(id: string): Promise<any[]> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      if (!tag) {
        throw new NotFoundException(`Tag with ID ${id} not found`);
      }

      return tag.products;
    } catch (error) {
      console.error('Error finding products for tag:', error);
      throw new InternalServerErrorException('Failed to find products for tag');
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    try {
      const tag = await this.tagRepository.preload({
        id,
        ...updateTagDto,
      });

      if (!tag) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }

      return await this.tagRepository.save(tag);
    } catch (error) {
      console.error('Error updating tag:', error);
      throw new InternalServerErrorException('Failed to update tag');
    }
  }

  async remove(id: string) {
    try {

      const result = await this.tagRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
      return result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw new InternalServerErrorException('Failed to delete tag');
    }
  }

  async findTopSellingTags(): Promise<
    { tagName: string; totalSales: number }[]
  > {
    try {
      const tags = await this.tagRepository.find();

      const tagsWithSales = await Promise.all(
        tags.map(async (tag) => {
          const totalSales = await this.productRepository
            .createQueryBuilder('product')
            .innerJoin('product.tags', 'tag')
            .where('tag.id = :tagId', { tagId: tag.id })
            .select('SUM(product.numberOfSales)', 'totalSales')
            .getRawOne();

          return {
            tagName: tag.name,
            totalSales:
              totalSales && totalSales.totalSales
                ? parseInt(totalSales.totalSales, 10)
                : 0,
          };
        }),
      );

      return tagsWithSales;
    } catch (error) {
      console.error('Error finding top-selling tags:', error);
      throw new InternalServerErrorException('Failed to find top-selling tags');
    }
  }
}
