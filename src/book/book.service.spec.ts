import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaModule } from 'nestjs-prisma';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('populateBooks', () => {
    it('should return the success message', async () => {
      await service.populateBooks().then((res) => {
        expect(res.success).toBe(true);
        expect(res.message).toBe('The books have been successfully populated.');
      });
    });
  });

  describe('getAvailableBooks', () => {
    it('should return an array of books', async () => {
      const availableBooks = await service.getAvailableBooks();
      expect(availableBooks).toBe(service.BOOKS);
    });
  });

  describe('getBorrowedBooks', () => {
    it('should return the information about the member, and the list of the borrowed books', async () => {
      await service.getBorrowedBooks('M001').then((res) => {
        expect(typeof res.success).toBe('boolean');
        expect(res.member).toHaveProperty('memberCode');
        expect(res.member).toHaveProperty('memberName');
        expect(res.borrowedBooks).toBeInstanceOf(Array);
        if (res.message !== undefined) {
          expect(typeof res.message).toBe('string');
        } else {
          expect(typeof res.message).toBe('undefined');
        }
      });
    });
  });

  describe('getBorrowedBooks', () => {
    it('should throw an UnauthorizedException', async () => {
      await service.getBorrowedBooks('john').catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
      });
    });
  });

  describe('borrowBooks', () => {
    it('should return the success message', async () => {
      await service
        .borrowBooks({
          memberCode: 'M002',
          bookCodes: ['HOB-83'],
        })
        .then((res) => {
          expect(res.success).toBe(true);
          expect(res.message).toBe('HOB-83 has been successfully borrowed.');
        });
    });
  });

  describe('borrowBooks', () => {
    it('should throw a ForbiddenException for a penalized member', async () => {
      await service
        .borrowBooks({
          memberCode: 'M001',
          bookCodes: ['TW-11'],
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(ForbiddenException);
        });
    });
  });

  describe('borrowBooks', () => {
    it('should throw a BadRequestException for a request that has more than 2 books to borrowed', async () => {
      await service
        .borrowBooks({
          memberCode: 'M002',
          bookCodes: ['TW-11', 'NRN-7', 'SHR-1'],
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
    });
  });

  describe('borrowBooks', () => {
    it('should throw a BadRequestException for a request to the book that does not exists', async () => {
      await service
        .borrowBooks({
          memberCode: 'M002',
          bookCodes: ['nothing'],
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
    });
  });

  describe('borrowBooks', () => {
    it('should throw a BadRequestException for a request to the book that is currently borrowed', async () => {
      await service
        .borrowBooks({
          memberCode: 'M003',
          bookCodes: ['HOB-83'],
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
    });
  });

  describe('returnBooks', () => {
    it('should return the success message', async () => {
      await service
        .returnBooks({
          memberCode: 'M002',
          bookCodes: ['HOB-83'],
        })
        .then((res) => {
          expect(res.success).toBe(true);
          expect(res.message).toBe(
            'The books HOB-83 has been successfully returned.',
          );
        });
    });
  });

  describe('returnBooks', () => {
    it('should return a BadRequestException for a request to the book that is currently not borrowed', async () => {
      await service
        .returnBooks({
          memberCode: 'M003',
          bookCodes: ['HOB-83'],
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
    });
  });

  describe('returnBooks', () => {
    it('should return an UnauthorizedException for a requested member that does not exist', async () => {
      await service
        .returnBooks({
          memberCode: 'john',
          bookCodes: ['HOB-83'],
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(UnauthorizedException);
        });
    });
  });

  describe('returnBooks', () => {
    it('should return a BadRequestException for a request that does not provides any book codes', async () => {
      await service
        .returnBooks({
          memberCode: 'M003',
          bookCodes: [],
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
        });
    });
  });

  afterAll(async () => {
    await service.reset();
  });
});
