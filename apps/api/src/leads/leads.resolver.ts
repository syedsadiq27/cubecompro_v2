import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { FUNNEL } from './funnel';
import { LeadsService } from './leads.service';

@ObjectType()
class FunnelStageModel {
  @Field()
  id: string;

  @Field()
  label: string;
}

@ObjectType()
class LeadFunnelStatusModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  submittedAt: string;

  @Field()
  status: string;

  @Field()
  updatedAt: Date;
}

@Resolver()
export class LeadsResolver {
  constructor(private readonly leads: LeadsService) {}

  @Query(() => [FunnelStageModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  leadFunnel() {
    return [...FUNNEL];
  }

  @Query(() => [LeadFunnelStatusModel])
  @UseGuards(JwtAuthGuard, OwnerGuard)
  leadFunnelStatuses() {
    return this.leads.listStatuses();
  }

  @Mutation(() => LeadFunnelStatusModel)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  setLeadFunnelStatus(
    @Args('email') email: string,
    @Args('submittedAt') submittedAt: string,
    @Args('status') status: string
  ) {
    return this.leads.setStatus(email, submittedAt, status);
  }
}
