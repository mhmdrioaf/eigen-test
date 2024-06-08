import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { MemberService } from './member.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({
    summary:
      'Returns all registered members, with the number of book(s) borrowed',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns all registered members, with the number of book(s) borrowed',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'M001',
            description: 'The member code',
          },
          name: {
            type: 'string',
            example: 'Putri',
            description: 'The member name',
          },
          isPenalized: {
            type: 'boolean',
            example: false,
            description: 'Whether the member is penalized or not',
          },
          penalizedAt: {
            type: 'date',
            nullable: true,
            example: null,
            description: 'The date when the member was penalized',
          },
          borrowedBooks: {
            type: 'number',
            example: 2,
            description: 'The number of books borrowed by the member',
          },
        },
      },
    },
  })
  async getAllMembers(): Promise<TMemberWithBooks[]> {
    return this.memberService.getAllMembers();
  }
}
