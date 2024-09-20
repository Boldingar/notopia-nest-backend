// src/tag/tag.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      const { name, imgUrl } = createTagDto;

      const tag = this.tagRepository.create({
        name,
        imgUrl,
        products: [],
      });

      return this.tagRepository.save(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new BadRequestException('Failed to create tag');
    }
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ relations: ['products'] });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return tag;
  }

  async findProducts(id: string): Promise<any[]> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag.products;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.preload({
      id,
      ...updateTagDto,
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
  }

  async findTopSellingTags(): Promise<
    { tagName: string; totalSales: number }[]
  > {
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
          totalSales: totalSales && totalSales.totalSales
            ? parseInt(totalSales.totalSales, 10)
            : 0,
        };
      }),
    );

    return tagsWithSales;
  }
}
