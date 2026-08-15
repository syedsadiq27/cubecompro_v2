import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { ShopifyImportResolver } from './shopify-import.resolver';
import { ShopifyImportService } from './shopify-import.service';
import { ShopifyOAuthController } from './shopify-oauth.controller';

@Module({
  imports: [ProductModule],
  controllers: [ShopifyOAuthController],
  providers: [ShopifyImportService, ShopifyImportResolver],
  exports: [ShopifyImportService],
})
export class IntegrationsModule {}
