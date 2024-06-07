import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @HttpCode(HttpStatus.OK)
  @Post('populate')
  async populateBooks() {
    try {
      return await this.bookService.populateBooks();
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAvailableBooks() {
    try {
      return await this.bookService.getAvailableBooks();
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('borrowed')
  async getBorrowedBooks(@Body() body: { memberCode: string }) {
    try {
      return await this.bookService.getBorrowedBooks(body.memberCode);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('borrow')
  async borrowBooks(@Body() body: IBorrowBookDto) {
    try {
      return await this.bookService.borrowBooks(body);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('return')
  async returnBooks(@Body() body: IBorrowBookDto) {
    try {
      return await this.bookService.returnBooks(body);
    } catch (error) {
      throw error;
    }
  }
}
