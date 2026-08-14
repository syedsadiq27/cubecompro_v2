import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { EntitlementModule } from '../entitlements/entitlement.module';
import { LibraryResolver } from './library.resolver';
import { LibraryService } from './library.service';

@Module({
  imports: [DocumentsModule, EntitlementModule],
  providers: [LibraryService, LibraryResolver],
  exports: [LibraryService],
})
export class LibraryModule {}
