import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [BookModule, MemberModule, LibraryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
