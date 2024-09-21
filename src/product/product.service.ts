import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In, MoreThan } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductType } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { validate as uuidValidate } from 'uuid';
import { Brand } from 'src/brand/entities/brand.entity';
import { Tag } from 'src/tag/entities/tag.entity';
// import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const {
        brandId,
        categoryIds,
        tagsId,
        images,
        linkedProducts,
        ...productData
      } = createProductDto;
      ////////////TAGS/////////////////
      let parsedTagsIds: string[] = [];
      let tempTagId = '';
      for (let i = 0; i < tagsId.length; i++) {
        if (tagsId[i] === ',') {
          parsedTagsIds.push(tempTagId.trim());
          tempTagId = '';
        } else {
          tempTagId += tagsId[i];
        }
      }
      // Push the last id
      if (tempTagId) {
        parsedTagsIds.push(tempTagId.trim());
      }

      // Ensure tagsId is an array
      if (!Array.isArray(parsedTagsIds)) {
        throw new BadRequestException('tagsId must be an array');
      }

      // Fetch the categories
      const tags = await this.tagRepository.find({
        where: { id: In(parsedTagsIds) },
      });

      if (parsedTagsIds.length !== tags.length) {
        throw new NotFoundException('One or more tags not found');
      }
      /////////////////CATEGORY////////////////////
      let parsedCategoryIds: string[] = [];
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
      /////////////////LINKEDPRODUCTS/////////////
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
      const brand = brandId
        ? await this.brandRepository.findOne({ where: { id: brandId } })
        : null;
      if (brandId && !brand) {
        throw new NotFoundException('Brand not found');
      }
      // Create the product
      const product = this.productRepository.create({
        ...productData,
        categories, // Set categories
        brand,
        images,
        tags,
        linkedProducts: linkedProductEntities, // Set linked products
      });

      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException('Failed to create product');
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit); // At least 1 item per page
    const skip = Math.max(0, (page - 1) * take); // Ensure non-negative skip

    const [result, total] = await this.productRepository.findAndCount({
      relations: ['categories', 'linkedProducts', 'brand'],
      take,
      skip,
    });

    return { data: result, total };
  }

  async findMain(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const [result, total] = await this.productRepository.findAndCount({
      where: { type: ProductType.MAIN },
      relations: ['categories', 'linkedProducts'],
      take,
      skip,
    });

    return { data: result, total };
  }

  async findSide(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const [result, total] = await this.productRepository.findAndCount({
      where: { type: ProductType.SIDE },
      relations: ['categories', 'linkedProducts'],
      take,
      skip,
    });

    return { data: result, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'linkedProducts', 'brand'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findLinkedProducts(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['linkedProducts'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const linkedProducts = product.linkedProducts.slice(skip, skip + take);
    const total = product.linkedProducts.length;

    return { data: linkedProducts, total };
  }

  async findProductsByBrand(brandId: string): Promise<Product[]> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found`);
    }

    return this.productRepository.find({ where: { brand } });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    var { categoryIds, images, brandId, linkedProducts, ...updateData } =
      updateProductDto;
    if (!images) {
      images = [];
    }
    // Parse and merge linkedProducts
    let parsedLinkedProductEntities: string[] = [];
    let tempId2 = '';
    for (let i = 0; i < linkedProducts.length; i++) {
      if (linkedProducts[i] === ',') {
        parsedLinkedProductEntities.push(tempId2.trim());
        tempId2 = '';
      } else {
        tempId2 += linkedProducts[i];
      }
    }
    if (tempId2) {
      parsedLinkedProductEntities.push(tempId2.trim());
    }
    const brand = brandId
      ? await this.brandRepository.findOne({ where: { id: brandId } })
      : null;
    if (brandId && !brand) {
      throw new NotFoundException('Brand not found');
    }
    const linkedProductEntities = linkedProducts
      ? await this.productRepository.find({
          where: { id: In(parsedLinkedProductEntities) },
        })
      : [];
    if (parsedLinkedProductEntities.length !== linkedProductEntities.length) {
      throw new NotFoundException('One or more linked products not found');
    }
    console.log('abllllllll el await');
    const product = await this.productRepository.preload({
      id,
      ...updateData,
      images,
      brand,
      linkedProducts: linkedProductEntities,
    });
    console.log('ba3ddd el await');

    let parsedCategoryIds: string[] = [];
    if (categoryIds) {
      let tempId = '';
      for (let i = 0; i < categoryIds.length; i++) {
        if (categoryIds[i] === ',') {
          parsedCategoryIds.push(tempId.trim());
          tempId = '';
        } else {
          tempId += categoryIds[i];
        }
      }
      if (tempId) {
        parsedCategoryIds.push(tempId.trim());
      }

      const categories = await this.categoryRepository.find({
        where: { id: In(parsedCategoryIds) },
      });
      if (parsedCategoryIds.length !== categories.length) {
        throw new NotFoundException('One or more categories not found');
      }
      product.categories = categories;
    }
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    console.log(product);

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

  async searchProductsByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const [result, total] = await this.productRepository.findAndCount({
      where: { name: ILike(`%${name}%`) },
      take,
      skip,
    });

    return { data: result, total };
  }
  async getFlashSales(): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await this.productRepository.findAndCount({
      where: {
        discountPercentage: MoreThan(30),
      },
    });
    return { data, total };
  }

  async getRelatedProducts(
    productId: string,
  ): Promise<{ product: Product; mutualTagCount: number }[]> {
    // Step 1: Find the product by its ID
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['tags'], // Assuming the product entity has a relation to the tags
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const tags = product.tags;

    if (!tags || tags.length === 0) {
      return [];
    }

    // Step 2: Fetch related products that share tags with the given product
    const relatedProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds: tags.map((tag) => tag.id) })
      .andWhere('product.id != :productId', { productId })
      .getMany();

    // Step 3: Calculate the number of mutual tags for each related product
    const productsWithMutualTagCount = relatedProducts.map((relatedProduct) => {
      // Count mutual tags between current product and related product
      const mutualTagCount = relatedProduct.tags.filter((tag) =>
        tags.some((productTag) => productTag.id === tag.id),
      ).length;

      return {
        product: relatedProduct,
        mutualTagCount,
      };
    });

    // Step 4: Sort products by the number of mutual tags in descending order
    productsWithMutualTagCount.sort(
      (a, b) => b.mutualTagCount - a.mutualTagCount,
    );

    // Step 5: Return the sorted products with their mutual tag counts
    return productsWithMutualTagCount;
  }
}
