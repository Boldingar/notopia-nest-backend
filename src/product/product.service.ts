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
import { Order } from 'src/order/entities/order.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

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
      let categories;
      let linkedProductEntities;
      let tags;
      let brand;
      ////////////TAGS/////////////////
      if (tagsId) {
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
        if (tempTagId) {
          parsedTagsIds.push(tempTagId.trim());
        }

        if (!Array.isArray(parsedTagsIds)) {
          throw new BadRequestException('tagsId must be an array');
        }

        tags = await this.tagRepository.find({
          where: { id: In(parsedTagsIds) },
        });

        if (parsedTagsIds.length !== tags.length) {
          throw new NotFoundException('One or more tags not found');
        }
      }
      /////////////////CATEGORY////////////////////
      if (categoryIds) {
        let parsedCategoryIds: string[] = [];
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

        if (!Array.isArray(parsedCategoryIds)) {
          throw new BadRequestException('categoryIds must be an array');
        }

        categories = await this.categoryRepository.find({
          where: { id: In(parsedCategoryIds) },
        });

        if (parsedCategoryIds.length !== categories.length) {
          throw new NotFoundException('One or more categories not found');
        }
      }
      /////////////////LINKEDPRODUCTS/////////////
      if (linkedProducts) {
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
        if (!Array.isArray(parsedLinkedProductEntities)) {
          throw new BadRequestException('linkedProducts must be an array');
        }

        linkedProductEntities = linkedProducts
          ? await this.productRepository.find({
              where: { id: In(parsedLinkedProductEntities) },
            })
          : [];
        if (
          parsedLinkedProductEntities.length !== linkedProductEntities.length
        ) {
          throw new NotFoundException('One or more categories not found');
        }
      }
      if (brandId) {
        brand = brandId
          ? await this.brandRepository.findOne({ where: { id: brandId } })
          : null;
        if (brandId && !brand) {
          throw new NotFoundException('Brand not found');
        }
      }
      var product;
      if (images) {
        product = this.productRepository.create({
          ...productData,
          categories,
          brand,
          images,
          tags,
          linkedProducts: linkedProductEntities,
        });
      } else {
        product = this.productRepository.create({
          ...productData,
          categories,
          brand,
          tags,
          linkedProducts: linkedProductEntities,
        });
      }

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
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const [result, total] = await this.productRepository.findAndCount({
      take,
      skip,
      relations: ['categories'],
    });
    return { data: result, total };
  }

  async findTopSellingProducts(
    page: number,
    limit: number,
  ): Promise<{
    data: { product: Product; numberOfSales: number }[];
    total: number;
  }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    // Get the total count of products
    const [products, total] = await this.productRepository.findAndCount({
      take,
      skip,
      relations: ['categories'],
    });

    // Sort the products by number of sales
    const sortedProducts = products.sort(
      (a, b) => (b.numberOfSales || 0) - (a.numberOfSales || 0),
    );

    // Map the products to the expected structure
    const data = sortedProducts.map((product) => ({
      product: product,
      numberOfSales: product.numberOfSales || 0,
    }));

    return { data, total };
  }

  async getFlashSales(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const [data, total] = await this.productRepository.findAndCount({
      where: {
        discountPercentage: MoreThan(30),
      },
      take,
      skip,
      relations: ['categories'],
    });
    return { data, total };
  }

  async findMain(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const [result, total] = await this.productRepository.findAndCount({
      where: { type: ProductType.MAIN },
      // relations: ['categories', 'linkedProducts'],
      take,
      skip,
      relations: ['categories'],
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
      // relations: ['categories', 'linkedProducts'],
      take,
      skip,
      relations: ['categories'],
    });

    return { data: result, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'linkedProducts', 'brand', 'tags'],
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
      relations: ['linkedProducts', 'categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const linkedProducts = product.linkedProducts.slice(skip, skip + take);
    const total = product.linkedProducts.length;

    return { data: linkedProducts, total };
  }

  async findProductsByBrand(
    brandId: string,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found`);
    }

    const [result, total] = await this.productRepository.findAndCount({
      where: { brand },
      take,
      skip,
      relations: ['categories'],
    });

    return { data: result, total };
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
    let parsedLinkedProductEntities: string[] = [];
    let tempId2 = '';
    if (linkedProducts) {
      for (let i = 0; i < linkedProducts.length; i++) {
        if (linkedProducts[i] === ',') {
          parsedLinkedProductEntities.push(tempId2.trim());
          tempId2 = '';
        } else {
          tempId2 += linkedProducts[i];
        }
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
    const product = await this.productRepository.preload({
      id,
      ...updateData,
      images,
      brand,
      linkedProducts: linkedProductEntities,
    });

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

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Find orders containing the product
        const orders = await transactionalEntityManager
          .createQueryBuilder(Order, 'order')
          .leftJoinAndSelect('order.products', 'product')
          .where('product.id = :id', { id })
          .getMany();

        // Remove the product from each order
        for (const order of orders) {
          order.products = order.products.filter(
            (product) => product.id !== id,
          );
          await transactionalEntityManager.save(order);
        }
        // Delete related cart items
        const cartItems = await transactionalEntityManager
          .createQueryBuilder(CartItem, 'cartItem')
          .leftJoinAndSelect('cartItem.product', 'product')
          .where('product.id = :id', { id })
          .getMany();

        for (const cartItem of cartItems) {
          await transactionalEntityManager.remove(cartItem);
        }

        // Delete the product
        const result = await transactionalEntityManager.delete(Product, id);

        if (result.affected === 0) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
      },
    );
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
      relations: ['categories'],
    });

    return { data: result, total };
  }

  async getRelatedProducts(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: { product: Product; mutualTagCount: number }[];
    total: number;
  }> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['tags', 'categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const tags = product.tags;

    if (!tags || tags.length === 0) {
      return { data: [], total: 0 };
    }

    // Set pagination variables
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    // Query to find related products
    const [relatedProducts, total] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds: tags.map((tag) => tag.id) })
      .andWhere('product.id != :productId', { productId })
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const productsWithMutualTagCount = relatedProducts.map((relatedProduct) => {
      const mutualTagCount = relatedProduct.tags.filter((tag) =>
        tags.some((productTag) => productTag.id === tag.id),
      ).length;

      return {
        product: relatedProduct,
        mutualTagCount,
      };
    });

    productsWithMutualTagCount.sort(
      (a, b) => b.mutualTagCount - a.mutualTagCount,
    );

    return { data: productsWithMutualTagCount, total };
  }

  async newArrivals(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const take = Math.max(1, limit);
    const skip = Math.max(0, (page - 1) * take);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const [data, total] = await this.productRepository.findAndCount({
      where: {
        createdAt: MoreThan(fiveDaysAgo),
      },
      take,
      skip,
      relations: ['categories'],
    });

    return { data, total };
  }
}
