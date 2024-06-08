import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MemberService {
  constructor(private db: PrismaService) {}

  MEMBERS: TMember[] = [
    {
      code: 'M001',
      name: 'Angga',
      isPenalized: true,
      penalizedAt: new Date('2024-06-07T10:25:09.230Z'),
    },
    {
      code: 'M002',
      name: 'Ferry',
      isPenalized: false,
      penalizedAt: null,
    },
    {
      code: 'M003',
      name: 'Putri',
      isPenalized: false,
      penalizedAt: null,
    },
  ];

  async getAllMembers(): Promise<TMemberWithBooks[]> {
    try {
      const members = await this.db.member.findMany({
        include: {
          borrowedBooks: {
            where: {
              returnedAt: null,
            },
            select: {
              book: {
                select: {
                  code: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      const membersData: TMemberWithBooks[] = members.map((member) => ({
        ...member,
        borrowedBooks: member.borrowedBooks.length,
      }));

      return membersData;
    } catch (error) {
      console.error('Error fetching members: ', error);
      throw new Error('There was a problem while fetching members');
    }
  }

  async populateMembers(): Promise<IResponse> {
    try {
      const members = this.MEMBERS;
      await this.db.member.createMany({
        data: members,
        skipDuplicates: true,
      });

      return {
        success: true,
        message: 'Members populated successfully',
      };
    } catch (error) {
      console.error('Error populating members: ', error);
      throw new Error('There was a problem while populating members');
    }
  }
}
