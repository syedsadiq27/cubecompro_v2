import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { ResolveResolver } from './resolve.resolver';
import { ResolveService } from './resolve.service';

@Module({
  imports: [ProductModule],
  providers: [ResolveService, ResolveResolver],
  exports: [ResolveService],
})
export class ResolveModule {}
