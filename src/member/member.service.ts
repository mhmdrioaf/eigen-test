import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

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
}
