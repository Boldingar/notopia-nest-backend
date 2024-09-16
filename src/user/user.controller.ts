import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('user') // Group the controller under 'user' in Swagger UI
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post()
  @ApiBody({ type: CreateUserDto }) // Document the body input
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user' })
  @Patch(':id')
  @ApiBody({ type: UpdateUserDto }) // Document the body input for the update
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User has been deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @ApiOperation({ summary: 'Add a product to the user\'s cart' })
  @ApiResponse({ status: 200, description: 'The product has been added to the cart.' })
  @ApiResponse({ status: 404, description: 'User or product not found.' })
  @ApiResponse({ status: 400, description: 'Invalid product or user.' })
  @Post(':userId/cart/:productId')
  async addToCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.userService.addToCart(userId, productId);
  }

  @ApiOperation({ summary: 'Check out the user\'s cart' })
  @ApiResponse({ status: 201, description: 'Order has been created.' })
  @ApiResponse({ status: 404, description: 'User or address not found.' })
  @ApiResponse({ status: 400, description: 'Some products are out of stock.' })
  @Post(':userId/checkout')
  async checkOut(@Param('userId') userId: string) {
    return this.userService.checkOut(userId);
  }

  // New route to get all products in the user's cart
  @ApiOperation({ summary: 'Get all products in the user\'s cart' })
  @ApiResponse({ status: 200, description: 'List of products in the cart' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
  @Get(':userId/cart')
  async getCartProducts(@Param('userId') userId: string) {
    return this.userService.getCartProducts(userId);
  }
}