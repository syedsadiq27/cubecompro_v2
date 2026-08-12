import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateOrganizationInput,
  OrganizationEntitlementModel,
  OrganizationMemberModel,
  OrganizationModel,
  RoleModel,
} from '../graphql/models';
import { OrganizationService } from './organization.service';

@Resolver(() => OrganizationModel)
export class OrganizationResolver {
  constructor(private readonly organizations: OrganizationService) {}

  @Mutation(() => OrganizationModel)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput
  ): Promise<OrganizationModel> {
    const { organization } = await this.organizations.create(
      input.name,
      input.slug
    );
    return organization;
  }

  @Query(() => OrganizationModel)
  organization(
    @Args('id', { type: () => String }) id: string
  ): Promise<OrganizationModel> {
    return this.organizations.getById(id);
  }

  @Query(() => [OrganizationEntitlementModel])
  async organizationEntitlements(
    @Args('organizationId', { type: () => String }) organizationId: string
  ): Promise<OrganizationEntitlementModel[]> {
    const rows = await this.organizations.listEntitlements(organizationId);
    return rows.map((row) => ({
      id: row.id,
      key: row.key,
      value: JSON.stringify(row.value),
    }));
  }

  @Query(() => [OrganizationMemberModel])
  async organizationMembers(
    @Args('organizationId', { type: () => String }) organizationId: string
  ): Promise<OrganizationMemberModel[]> {
    const rows = await this.organizations.listMembers(organizationId);
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      email: row.user.email,
      name: row.user.name,
      roleName: row.role.name,
    }));
  }

  @Query(() => [RoleModel])
  organizationRoles(
    @Args('organizationId', { type: () => String }) organizationId: string
  ): Promise<RoleModel[]> {
    return this.organizations.listRoles(organizationId);
  }
}
