import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { ResolveModule } from '../resolve/resolve.module';
import { SavedConfigurationResolver } from './saved-configuration.resolver';
import { SavedConfigurationService } from './saved-configuration.service';

@Module({
  imports: [DocumentsModule, ResolveModule],
  providers: [SavedConfigurationService, SavedConfigurationResolver],
})
export class SavedConfigurationModule {}
