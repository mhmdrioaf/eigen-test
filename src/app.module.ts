import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { LibraryModule } from './library/library.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    BookModule,
    MemberModule,
    LibraryModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
