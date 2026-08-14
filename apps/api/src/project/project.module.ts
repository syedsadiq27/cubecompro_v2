import { Module } from '@nestjs/common';
import { EntitlementModule } from '../entitlements/entitlement.module';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [EntitlementModule],
  providers: [ProjectService, ProjectResolver],
  exports: [ProjectService],
})
export class ProjectModule {}
