import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { BOOKS } from 'src/mock/book.mock';

@Injectable()
export class BookService {
  constructor(private db: PrismaService) {}

  async getAvailableBooks() {
    return await this.db.book.findMany({
      where: {
        stock: {
          not: 0,
        },
      },
    });
  }

  async getBorrowedBooks(
    memberCode: string,
  ): Promise<Array<Omit<TBook, 'stock'>>> {
    const memberData = this.db.member.findUnique({
      where: {
        code: memberCode,
      },
    });
    const booksData = this.db.bookBorrowedByMember.findMany({
      where: {
        memberCode: {
          equals: memberCode,
        },
      },
      select: {
        book: {
          select: {
            code: true,
            title: true,
          },
        },
      },
    });

    const [member, books] = await Promise.all([memberData, booksData]);

    if (!member) {
      throw new UnauthorizedException('Member does not exist.');
    }

    const borrowedBooks: Array<Omit<TBook, 'stock'>> = books.map((book) => ({
      author: book.book.code,
      title: book.book.title,
      code: book.book.code,
    }));

    return borrowedBooks;
  }

  async borrowBooks(dto: IBorrowBookDto): Promise<IResponse> {
    if (dto.bookCodes.length > 2) {
      throw new BadRequestException(
        'You can only borrow a maximum of 2 books at a time.',
      );
    }

    const member = await this.db.member.findUnique({
      where: {
        code: dto.memberCode,
      },
    });

    if (!member) {
      throw new UnauthorizedException('Member does not exist.');
    }

    if (member.isPenalized && member.penalizedAt) {
      const today = new Date();
      const penalizedAt = new Date(member.penalizedAt);
      const diff = today.getTime() - penalizedAt.getTime();
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (diffDays >= 3) {
        return await this.onBookBorrowed({
          ...dto,
          isUpdatePenaltyStatus: true,
        });
      } else {
        throw new ForbiddenException('Member is penalized, cannot borrow book');
      }
    } else {
      return await this.onBookBorrowed(dto);
    }
  }

  async onBookBorrowed(
    dto: IBorrowBookDto & { isUpdatePenaltyStatus?: boolean },
  ): Promise<IResponse> {
    try {
      const books = await this.db.book.findMany({
        where: {
          code: {
            in: dto.bookCodes,
          },
        },
        select: {
          code: true,
          stock: true,
        },
      });

      if (books.length < 1) {
        return {
          success: false,
          message: "The books you requested doesn't exists.",
        };
      }

      const filteredBooks = {
        available: books.filter((book) => book.stock > 0),
        unavailable: books.filter((book) => book.stock === 0),
      };

      const updateMemberPenaltyStatus = this.db.member // Updating member penalty status
        .update({
          where: {
            code: dto.memberCode,
          },
          data: {
            isPenalized: false,
            penalizedAt: null,
          },
        })
        .catch((err) => {
          console.error(
            '[PROMISE ERROR]: Member penalty status update failed: ',
            err,
          );
          throw new Error(
            'There was a problem while trying to update the member penalty status',
          );
        });

      const borrowBooks = this.db
        .$transaction(
          filteredBooks.available.map((book) =>
            this.db.bookBorrowedByMember.create({
              data: {
                memberCode: dto.memberCode,
                bookCode: book.code,
              },
            }),
          ),
        )
        .catch((err) => {
          console.error('[PROMISE ERROR]: Book borrow failed: ', err);
          throw new Error(
            'There was a problem while trying to borrow the book, please try again later.',
          );
        });

      const updateBookStock = this.db.book // Updating the book stock
        .updateMany({
          where: {
            code: {
              in: filteredBooks.available.map((book) => book.code),
            },
          },
          data: {
            stock: {
              decrement: 1,
            },
          },
        })
        .catch((err) => {
          console.error('[PROMISE ERROR]: Boo stock update failed: ', err);
          throw new Error(
            'There was a problem while trying to update the book stock',
          );
        });

      await Promise.all([
        updateMemberPenaltyStatus,
        borrowBooks,
        updateBookStock,
      ]);

      return {
        success: true,
        message: `${filteredBooks.available.map((book) => book.code).join(',')} has been successfully borrowed. ${filteredBooks.unavailable.length > 0 && (filteredBooks.unavailable.map((book) => book.code).join(','), 'is not available.')}`,
      };
    } catch (error) {
      console.error(
        'An error occurred while trying to borrow the book: ',
        error,
      );
      return {
        success: false,
        message:
          'There was a problem while trying to borrow the book, please try again later.',
      };
    }
  }

  async returnBooks(dto: IBorrowBookDto): Promise<IResponse> {
    try {
      const today = new Date();

      if (dto.bookCodes.length < 1) {
        throw new BadRequestException(
          'Please provide the book codes to return.',
        );
      }

      const member = this.db.member.findUnique({
        where: {
          code: dto.memberCode,
        },
      });

      const borrowedBooksData = this.db.bookBorrowedByMember.findMany({
        where: {
          AND: [
            {
              memberCode: {
                equals: dto.memberCode,
              },
            },
            {
              bookCode: {
                in: dto.bookCodes,
              },
            },
          ],
        },
      });

      const [isMemberExists, borrowedBooks] = await Promise.all([
        member,
        borrowedBooksData,
      ]);

      if (!isMemberExists) {
        throw new UnauthorizedException('Member does not exist.');
      }

      if (borrowedBooks.length < 1) {
        throw new BadRequestException(
          'The books you are trying to return are not borrowed by you.',
        );
      }

      const overdueBooks = borrowedBooks.filter((book) => {
        const borrowedAt = new Date(book.borrowedAt);
        const diff = today.getTime() - borrowedAt.getTime();
        const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return diffDays > 7;
      });

      if (overdueBooks.length > 0) {
        await this.db.member.update({
          where: {
            code: dto.memberCode,
          },
          data: {
            isPenalized: true,
            penalizedAt: today,
          },
        });
      }

      const updateBorrowedBookReturneeDate = this.db.bookBorrowedByMember
        .updateMany({
          where: {
            AND: [
              {
                memberCode: {
                  equals: dto.memberCode,
                },
              },
              {
                bookCode: {
                  in: borrowedBooks.map((book) => book.bookCode),
                },
              },
            ],
          },
          data: {
            returnedAt: today,
          },
        })
        .catch((err) => {
          console.error(
            '[PROMISE ERROR]: Book returnee date update failed: ',
            err,
          );
          throw new Error(
            'There was a problem while trying to update the book returnee date',
          );
        });

      const updateBooksStock = this.db.book
        .updateMany({
          where: {
            code: {
              in: borrowedBooks.map((book) => book.bookCode),
            },
          },
          data: {
            stock: {
              increment: 1,
            },
          },
        })
        .catch((err) => {
          console.error('[PROMISE ERROR]: Book stock update failed: ', err);
          throw new Error(
            'There was a problem while trying to update the book stock',
          );
        });

      await Promise.all([updateBorrowedBookReturneeDate, updateBooksStock]);
      return {
        success: true,
        message: `The books ${dto.bookCodes.join(',')} has been successfully returned.`,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async populateBooks(): Promise<IResponse> {
    const books = BOOKS;
    try {
      await this.db.book.createMany({
        data: books,
      });

      return {
        success: true,
        message: 'Books has been successfully created.',
      };
    } catch (error) {
      console.error(
        'An error occurred while trying to create the books: ',
        error,
      );
      return {
        success: false,
        message:
          'There was a problem while trying to create the books, please try again later.',
      };
    }
  }
}
