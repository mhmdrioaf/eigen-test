import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({
    summary: 'Get all books that are currently not borrowed by any member',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Books data retrieved',
    schema: {
      properties: {
        books: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The book unique code',
                example: 'JK-45',
              },
              title: {
                type: 'string',
                description: 'The book title',
                example: 'Harry Potter',
              },
              author: {
                type: 'string',
                description: 'The book author',
                example: 'J.K. Rowling',
              },
              stock: {
                type: 'number',
                description: 'The book stock',
                example: 1,
              },
            },
          },
        },
      },
    },
    isArray: true,
  })
  async getAvailableBooks() {
    try {
      return await this.bookService.getAvailableBooks();
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('borrowed/:memberCode')
  @ApiOperation({
    summary: 'Get all books that are currently borrowed by a member',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The response if the member borrowed books data are retrieved',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
          description: 'Request status',
        },
        member: {
          type: 'object',
          properties: {
            memberCode: {
              type: 'string',
              description: 'Requested member code',
              example: 'M003',
            },
            memberName: {
              type: 'string',
              description: 'Requested member name',
              example: 'Putri',
            },
          },
        },
        borrowedBooks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bookCode: {
                type: 'string',
                description: 'Borrowed book code',
                example: 'JK-45',
              },
              bookTitle: {
                type: 'string',
                description: 'Borrowed book title',
                example: 'Harry Potter',
              },
              borrowedAt: {
                type: 'date',
                example: '2024-06-07T11:28:16.791Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "The response if the requested member doesn't exists",
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'Member does not exist.',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 401,
          description: 'The error status code',
        },
      },
    },
  })
  @ApiParam({
    required: true,
    name: 'memberCode',
    allowEmptyValue: false,
    description:
      'The member code, please note that this parameter is case-sensitive, so please provide the correct member code',
    schema: {
      type: 'string',
      example: 'M003',
    },
  })
  async getBorrowedBooks(@Param() param: { memberCode: string }) {
    try {
      return await this.bookService.getBorrowedBooks(param.memberCode);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('borrow')
  @ApiOperation({ summary: 'Borrow books' })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        memberCode: {
          type: 'string',
          description: 'The member code',
          example: 'M003',
        },
        bookCodes: {
          type: 'array',
          items: {
            type: 'string',
            description: 'The book code',
            example: 'JK-45',
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'The response if the books are successfully borrowed',
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
          description: 'Request status',
        },
        message: {
          type: 'string',
          example: 'JK-45, SHR-1 has been successfully borrowed.',
          description: 'The response message',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The response if the member requested the books are not exists',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: "The books you requested doesn't exists",
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 400,
          description: 'The error status code',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The response if the member requested the books are not available to be borrowed',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'JK-45 is not available',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 400,
          description: 'The error status code',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The response if the member trying to borrow more than 2 books',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'You can only borrow a maximum of 2 books at a time',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 400,
          description: 'The error status code',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'The response if the member is currently penalized. To test this response, please use the member code M001',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'Member is penalized, cannot borrow book',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 403,
          description: 'The error status code',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The response if the member requested is not exists',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'Member does not exist.',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 401,
          description: 'The error status code',
        },
      },
    },
  })
  async borrowBooks(@Body() body: IBorrowBookDto) {
    try {
      return await this.bookService.borrowBooks(body);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('return')
  @ApiOperation({ summary: 'Return books' })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        memberCode: {
          type: 'string',
          description: 'The member code',
          example: 'M003',
        },
        bookCodes: {
          type: 'array',
          items: {
            type: 'string',
            description: 'The book code',
            example: 'JK-45',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The response if the member does not provides any book code',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'Please provide the book codes to return',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 400,
          description: 'The error status code',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The response if the member provides book codes that does not borrowed by the member',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'The books you are trying to return are not borrowed by you',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 400,
          description: 'The error status code',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The response if the member requested is not exists',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'The request status',
        },
        message: {
          type: 'string',
          example: 'Member does not exist.',
          description: 'The error message',
        },
        statusCode: {
          type: 'number',
          example: 401,
          description: 'The error status code',
        },
      },
    },
  })
  async returnBooks(@Body() body: IBorrowBookDto) {
    try {
      return await this.bookService.returnBooks(body);
    } catch (error) {
      throw error;
    }
  }
}
