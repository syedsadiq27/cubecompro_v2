import { join } from 'node:path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { HealthController } from './health.controller';
import { HealthResolver } from './health.resolver';
import { LibraryModule } from './library/library.module';
import { OrganizationModule } from './organization/organization.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ProjectModule } from './project/project.module';
import { ResolveModule } from './resolve/resolve.module';
import { SavedConfigurationModule } from './saved-configuration/saved-configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'development'
          ? join(process.cwd(), 'src', 'schema.gql')
          : true,
      sortSchema: true,
      path: '/graphql',
      context: ({ req }: { req: unknown }) => ({ req }),
    }),
    PrismaModule,
    DocumentsModule,
    AuthModule,
    OrganizationModule,
    ProjectModule,
    ProductModule,
    LibraryModule,
    ResolveModule,
    SavedConfigurationModule,
  ],
  controllers: [HealthController],
  providers: [HealthResolver],
})
export class AppModule {}
