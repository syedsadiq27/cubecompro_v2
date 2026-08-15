import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { ConstraintService } from './constraint.service';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [DocumentsModule],
  providers: [ProductService, ProductResolver, ConstraintService],
  exports: [ProductService, ConstraintService],
})
export class ProductModule {}
