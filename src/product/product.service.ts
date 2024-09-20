import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductType } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { validate as uuidValidate } from 'uuid';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

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
      let parsedCategoryIds: string[] = [];
      const { categoryIds, images, linkedProducts, ...productData } =
        createProductDto;
      // Ensure categoryIds is an array of strings
      let tempId = '';
      for (let i = 0; i < categoryIds.length; i++) {
        if (categoryIds[i] === ',') {
          parsedCategoryIds.push(tempId.trim());
          tempId = '';
        } else {
          tempId += categoryIds[i];
        }
      }
      // Push the last id
      if (tempId) {
        parsedCategoryIds.push(tempId.trim());
      }

      // Ensure categoryIds is an array
      if (!Array.isArray(parsedCategoryIds)) {
        throw new BadRequestException('categoryIds must be an array');
      }

      // Fetch the categories
      const categories = await this.categoryRepository.find({
        where: { id: In(parsedCategoryIds) },
      });

      if (parsedCategoryIds.length !== categories.length) {
        throw new NotFoundException('One or more categories not found');
      }
      ///////////////////////////
       let parsedLinkedProductEntities: string[] = [];
      // Ensure linkedProducts is an array of strings
      let tempId2 = '';
      for (let i = 0; i < linkedProducts.length; i++) {
        if (linkedProducts[i] === ',') {
          parsedLinkedProductEntities.push(tempId2.trim());
          tempId2 = '';
        } else {
          tempId2 += linkedProducts[i];
        }
      }
      // Push the last id
      if (tempId2) {
        parsedLinkedProductEntities.push(tempId2.trim());
      }
      // Ensure linkedProducts is an array
      if (!Array.isArray(parsedLinkedProductEntities)) {
        throw new BadRequestException('linkedProducts must be an array');
      }

      // Fetch the linked products
      const linkedProductEntities = linkedProducts
        ? await this.productRepository.find({
            where: { id: In(parsedLinkedProductEntities) },
          })
        : [];
      if (parsedLinkedProductEntities.length !== linkedProductEntities.length) {
        throw new NotFoundException('One or more categories not found');
      }
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
      relations: ['categories', 'linkedProducts'],
    });
  }

  async findMain(): Promise<Product[]> {
    return this.productRepository.find({
      where: { type: ProductType.MAIN },
      relations: ['categories', 'linkedProducts'],
    });
  }

  async findSide(): Promise<Product[]> {
    return this.productRepository.find({
      where: { type: ProductType.SIDE },
      relations: ['categories', 'linkedProducts'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'linkedProducts'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findLinkedProducts(productId: string): Promise<Product[]> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['linkedProducts'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      return product.linkedProducts;
    } catch (error) {
      console.error('Error finding linked products:', error);
      throw new InternalServerErrorException('Failed to find linked products');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { categoryIds, images, linkedProducts, ...updateData } =
      updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...updateData,
      images,
      linkedProducts: linkedProducts
        ? await this.productRepository.find({
            where: { id: In(linkedProducts) },
          })
        : [],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (categoryIds) {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });

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

  async findTopSellingProducts(): Promise<
    { productName: string; numberOfSales: number }[]
  > {
    const products = await this.productRepository.find();

    const sortedProducts = products.sort(
      (a, b) => b.numberOfSales - a.numberOfSales,
    );

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

  async findAllPaginated(page: number, limit: number): Promise<{ data: Product[], total: number }> {
    const take = Math.max(1, limit); // At least 1 item per page
    const skip = Math.max(0, (page - 1) * take); // Ensure non-negative skip

    console.log(`Pagination -> page: ${page}, limit: ${limit}, take: ${take}, skip: ${skip}`);

    const [result, total] = await this.productRepository.findAndCount({
        take,
        skip,
    });

    return { data: result, total };
}

}
