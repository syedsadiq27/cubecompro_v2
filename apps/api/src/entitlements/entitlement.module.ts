import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrganizationModule } from '../organization/organization.module';
import { EntitlementResolver } from './entitlement.resolver';
import { EntitlementService } from './entitlement.service';

@Module({
  imports: [AuthModule, OrganizationModule],
  providers: [EntitlementService, EntitlementResolver],
  exports: [EntitlementService],
})
export class EntitlementModule {}
