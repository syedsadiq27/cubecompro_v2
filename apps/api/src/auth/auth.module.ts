import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OwnerGuard } from './owner.guard';

@Module({
  providers: [AuthService, AuthResolver, JwtAuthGuard, OwnerGuard],
  exports: [AuthService, JwtAuthGuard, OwnerGuard],
})
export class AuthModule {}
