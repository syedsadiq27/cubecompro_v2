import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { ConstraintService } from './constraint.service';
import { LegacyRuleMigrationService } from './legacy-rule-migration.service';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [DocumentsModule],
  providers: [
    ProductService,
    ProductResolver,
    ConstraintService,
    LegacyRuleMigrationService,
  ],
  exports: [ProductService, ConstraintService, LegacyRuleMigrationService],
})
export class ProductModule {}
