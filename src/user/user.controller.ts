import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: "Add a product to the user's wishlist" })
  @ApiResponse({
    status: 200,
    description: 'The product has been added to the wishlist.',
  })
  @ApiResponse({ status: 404, description: 'User or product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid product or user.' })
  @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
  @ApiParam({
    name: 'productId',
    type: String,
    description: 'ID of the product to add to the wishlist',
  })
  @Post(':userId/wishlist/:productId')
  async addToWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<User> {
    return this.userService.addToWishlist(userId, productId);
  }

  @ApiOperation({ summary: "Remove a product from the user's wishlist" })
  @ApiResponse({
    status: 200,
    description: 'The product has been removed from the wishlist successfully.',
  })
  @ApiResponse({ status: 404, description: 'User or product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid product or user.' })
  @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
  @ApiParam({
    name: 'productId',
    type: String,
    description: 'ID of the product to remove from the wishlist',
  })
  @Delete(':userId/wishlist/:productId')
  async removeFromWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<User> {
    return this.userService.removeFromWishlist(userId, productId);
  }
  @ApiOperation({ summary: 'Get the number of users who already ordered once' })
  @ApiResponse({
    status: 200,
    description: 'Number and percentage of users who already ordered once.',
  })
  @Get('orderedUsersPercentage')
  async getOrderedUsersPercentage(): Promise<{
    orderedUsersCount: number;
    percentage: number;
  }> {
    const { orderedUsersCount, totalCustomersCount } =
      await this.userService.getOrderedUsersPercentage();

    const percentage =
      totalCustomersCount > 0
        ? parseFloat(
            ((orderedUsersCount / totalCustomersCount) * 100).toFixed(2),
          )
        : 0;

    return { orderedUsersCount, percentage };
  }

  @ApiOperation({ summary: 'Get total number of customers' })
  @ApiResponse({ status: 200, description: 'Total number of customers' })
  @Get('totalCustomers')
  async getTotalCustomers(): Promise<{ totalCustomers: number }> {
    const totalCustomers = await this.userService.getTotalCustomers();
    return { totalCustomers };
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user' })
  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findUserById(id);
    return user;
  }
  @ApiOperation({ summary: 'Get a user by phone' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'phone', type: String, description: 'phone of the user' })
  @Get('phone/:phone')
  async findUserByPhone(@Param('phone') phone: string) {
    return this.userService.findUserByPhone(phone);
  }

  @ApiOperation({ summary: 'Get all vouchers for a user' })
  @ApiParam({ name: 'userId', type: String })
  @Get(':userId/vouchers')
  getAllVouchers(@Param('userId') userId: string): Promise<Voucher[]> {
    return this.userService.getAllVouchers(userId);
  }

  @ApiOperation({ summary: 'Add a voucher to a user' })
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'voucherId', type: String })
  @Post(':userId/vouchers/:voucherId')
  addVoucher(
    @Param('userId') userId: string,
    @Param('voucherId') voucherId: string,
  ): Promise<User> {
    return this.userService.addVoucher(userId, voucherId);
  }

  @ApiOperation({ summary: 'Remove a voucher from a user' })
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'voucherId', type: String })
  @Delete(':userId/vouchers/:voucherId')
  removeVoucher(
    @Param('userId') userId: string,
    @Param('voucherId') voucherId: string,
  ): Promise<User> {
    return this.userService.removeVoucher(userId, voucherId);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'phone',
    type: String,
    description: 'Phone number of the user',
  })
  @Patch(':phone')
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('phone') phone: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(phone, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User has been deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @ApiOperation({ summary: "Empty the user's cart" })
  @ApiResponse({
    status: 200,
    description: 'The cart bocome empty.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid  user.' })
  @Post(':userId/emptyCart')
  async emptyUserCart(@Param('userId') userId: string) {
    return this.userService.emptyCart(userId);
  }

  @ApiOperation({ summary: "Check out the user's cart" })
  @ApiResponse({ status: 201, description: 'Order has been created.' })
  @ApiResponse({ status: 404, description: 'User or address not found.' })
  @ApiResponse({ status: 400, description: 'Some products are out of stock.' })
  @Post(':userId/checkout')
  @ApiQuery({
    name: 'voucherName',
    type: String,
    required: false,
    description: 'Optional voucher name to apply a discount',
  })
  async checkOut(
    @Param('userId') userId: string,
    @Query('addressIndex') addressIndex: number,
    @Query('voucherName') voucherName?: string,
  ) {
    return this.userService.checkOut(userId, addressIndex, voucherName);
  }

  @ApiOperation({ summary: "Get all products in the user's cart" })
  @ApiResponse({ status: 200, description: 'List of products in the cart' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
  @Get(':userId/cart')
  async getCartProducts(@Param('userId') userId: string) {
    return this.userService.getCartProducts(userId);
  }

  @ApiOperation({ summary: "Add a product to the user's cart" })
  @ApiResponse({
    status: 200,
    description: 'The product has been added to the cart.',
  })
  @ApiResponse({ status: 404, description: 'User or product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid product or user.' })
  @Post(':userId/cart/:productId')
  async addToCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userService.addToCart(userId, productId);
  }

  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({
    status: 200,
    description: 'Product has been removed from the cart successfully.',
  })
  @ApiResponse({ status: 404, description: 'User or product not found.' })
  @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
  @ApiParam({
    name: 'productId',
    type: String,
    description: 'ID of the product to remove from the cart',
  })
  @Delete(':userId/remove/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<{ message: string; cart: CartItem[]; totalPrice: number }> {
    const result = await this.userService.removeFromCart(userId, productId);
    return result;
  }
}
