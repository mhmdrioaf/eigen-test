import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { PrismaModule } from 'nestjs-prisma';

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllMembers', () => {
    it('should return an array of members with the number of borrowed books', async () => {
      await service.getAllMembers().then((res) => {
        expect(res).toBeInstanceOf(Array);
        expect(res[0]).toHaveProperty('code');
        expect(res[0]).toHaveProperty('name');
        expect(res[0]).toHaveProperty('isPenalized');
        expect(res[0]).toHaveProperty('penalizedAt');
        expect(res[0]).toHaveProperty('borrowedBooks');
      });
    });
  });

  describe('populateMembers', () => {
    it('should return the success message', async () => {
      await service.populateMembers().then((res) => {
        expect(res.success).toBe(true);
        expect(res.message).toBe('Members populated successfully');
      });
    });
  });
});
