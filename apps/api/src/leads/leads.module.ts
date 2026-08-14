import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LeadsResolver } from './leads.resolver';
import { LeadsService } from './leads.service';

@Module({
  imports: [AuthModule],
  providers: [LeadsService, LeadsResolver],
})
export class LeadsModule {}
