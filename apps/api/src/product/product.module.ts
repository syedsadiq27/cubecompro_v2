import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [DocumentsModule],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
