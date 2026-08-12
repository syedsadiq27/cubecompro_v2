import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentsController } from './documents.controller';
import { DocumentStoreService } from './document-store.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DocumentsController],
  providers: [DocumentStoreService],
  exports: [DocumentStoreService],
})
export class DocumentsModule {}
