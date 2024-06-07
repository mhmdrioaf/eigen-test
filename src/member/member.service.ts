import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { MEMBERS } from 'src/mock/member.mock';

@Injectable()
export class MemberService {
  constructor(private db: PrismaService) {}

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
      const members = MEMBERS;
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
