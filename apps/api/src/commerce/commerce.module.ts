import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { LiveCommerceResolver } from './live-commerce.resolver';
import { LiveCommerceService } from './live-commerce.service';

@Module({
  imports: [ProductModule],
  providers: [LiveCommerceService, LiveCommerceResolver],
  exports: [LiveCommerceService],
})
export class CommerceModule {}
