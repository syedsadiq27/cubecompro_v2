import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PlatformResolver } from './platform.resolver';
import { PlatformService } from './platform.service';

@Module({
  imports: [AuthModule],
  providers: [PlatformService, PlatformResolver],
  exports: [PlatformService],
})
export class PlatformModule {}
