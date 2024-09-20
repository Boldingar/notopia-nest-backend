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
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      let parsedCategoryIds: string[] = [];
      const { brandId,categoryIds, images, linkedProducts, ...productData } =
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
      
      const brand = brandId ? await this.brandRepository.findOne({ where: { id: brandId } }) : null;
      if (brandId && !brand) {
        throw new NotFoundException('Brand not found');
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
        brand,
        images,
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
      relations: ['categories', 'linkedProducts','brand'],
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
      relations: ['categories', 'linkedProducts','brand'],
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
    const brand = await this.brandRepository.findOne({ where: { id: brandId } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found`);
    }
  
    return this.productRepository.find({ where: { brand } });
  }
  
  // async update(
  //   id: string,
  //   updateProductDto: UpdateProductDto,
  // ): Promise<Product> {
  //   let { categoryIds, images, linkedProducts, ...updateData } =
  //     updateProductDto;
  //   // Fetch the existing product
  //   const existingProduct = await this.productRepository.findOne({
  //     where: { id },
  //   });
  //   if (!existingProduct) {
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }

  //   // Merge images
  //   if (images) {
  //     images = [...new Set([...existingProduct.images, ...images])];
  //   }

  //   // Parse and merge linkedProducts
  //   let parsedLinkedProductEntities: string[] = [];
  //   if (linkedProducts) {
  //     let tempId2 = '';
  //     for (let i = 0; i < linkedProducts.length; i++) {
  //       if (linkedProducts[i] === ',') {
  //         parsedLinkedProductEntities.push(tempId2.trim());
  //         tempId2 = '';
  //       } else {
  //         tempId2 += linkedProducts[i];
  //       }
  //     }
  //     if (tempId2) {
  //       parsedLinkedProductEntities.push(tempId2.trim());
  //     }
  //     const linkedProductEntities = linkedProducts
  //       ? await this.productRepository.find({
  //           where: { id: In(parsedLinkedProductEntities) },
  //         })
  //       : [];
  //     if (parsedLinkedProductEntities.length !== linkedProductEntities.length) {
  //       throw new NotFoundException('One or more linked products not found');
  //     }
  //     existingProduct.linkedProducts = [
  //       ...new Set([
  //         ...existingProduct.linkedProducts,
  //         ...linkedProductEntities,
  //       ]),
  //     ];
  //   }

  //   //////////////////////////
  //   let parsedCategoryIds: string[] = [];

  //   if (categoryIds) {
  //     let tempId = '';
  //     for (let i = 0; i < categoryIds.length; i++) {
  //       if (categoryIds[i] === ',') {
  //         parsedCategoryIds.push(tempId.trim());
  //         tempId = '';
  //       } else {
  //         tempId += categoryIds[i];
  //       }
  //     }
  //     if (tempId) {
  //       parsedCategoryIds.push(tempId.trim());
  //     }

  //     const categories = await this.categoryRepository.find({
  //       where: { id: In(parsedCategoryIds) },
  //     });
  //     if (parsedCategoryIds.length !== categories.length) {
  //       throw new NotFoundException('One or more categories not found');
  //     }
  //     existingProduct.categories = [
  //       ...new Set([...existingProduct.categories, ...categories]),
  //     ];
  //   }

  //   const product = await this.productRepository.preload({
  //     id,
  //     ...updateData,
  //     images,
  //     linkedProducts: existingProduct.linkedProducts,
  //     categories: existingProduct.categories,
  //   });
  //   console.log('3deeeeeeeeeeet');
  //   console.log(product);

  //   if (!product) {
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }

  //   return this.productRepository.save(product);
  // }
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    var { categoryIds, images,brandId, linkedProducts, ...updateData } =
      updateProductDto;
    if (!images) {
      images=[];
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
    const brand = brandId ? await this.brandRepository.findOne({ where: { id: brandId } }) : null;
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

  //   async findAllPaginated(page: number, limit: number): Promise<{ data: Product[], total: number }> {
  //     const take = Math.max(1, limit); // At least 1 item per page
  //     const skip = Math.max(0, (page - 1) * take); // Ensure non-negative skip

  //     console.log(`Pagination -> page: ${page}, limit: ${limit}, take: ${take}, skip: ${skip}`);

  //     const [result, total] = await this.productRepository.findAndCount({
  //         take,
  //         skip,
  //     });

  //     return { data: result, total };
  // }
}
