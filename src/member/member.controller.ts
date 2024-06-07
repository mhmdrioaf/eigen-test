import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllMembers(): Promise<TMemberWithBooks[]> {
    return this.memberService.getAllMembers();
  }

  @HttpCode(HttpStatus.OK)
  @Post('populate')
  async populateMembers(): Promise<IResponse> {
    return this.memberService.populateMembers();
  }
}
