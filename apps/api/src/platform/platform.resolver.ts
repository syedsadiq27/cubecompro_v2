import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { PlatformService } from './platform.service';

@ObjectType()
class PlatformSettingModel {
  @Field(() => ID)
  id: string;

  @Field()
  app: string;

  @Field()
  key: string;

  @Field()
  value: string;

  @Field()
  updatedAt: Date;
}

@InputType()
class UpsertPlatformSettingInput {
  @Field()
  app: string;

  @Field()
  key: string;

  @Field()
  value: string;
}

@Resolver()
export class PlatformResolver {
  constructor(private readonly platform: PlatformService) {}

  @Query(() => [PlatformSettingModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async platformSettings(
    @Args('app', { type: () => String, nullable: true }) app?: string
  ) {
    await this.platform.ensureDefaults();
    return this.platform.list(app);
  }

  @Mutation(() => [PlatformSettingModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  upsertPlatformSettings(
    @Args('input', { type: () => [UpsertPlatformSettingInput] })
    input: UpsertPlatformSettingInput[]
  ) {
    return this.platform.upsertMany(input);
  }
}
