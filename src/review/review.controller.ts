import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('Bearer')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    try {
      return await this.reviewService.create(createReviewDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create review',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.reviewService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to get reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const review = await this.reviewService.findOne(+id);
      if (!review) {
        throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
      }
      return review;
    } catch (error) {
      throw new HttpException(
        'Failed to get review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    try {
      const updatedReview = await this.reviewService.update(
        +id,
        updateReviewDto,
      );
      if (!updatedReview) {
        throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
      }
      return updatedReview;
    } catch (error) {
      throw new HttpException(
        'Failed to update review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.reviewService.remove(+id);
      if (!result) {
        throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
