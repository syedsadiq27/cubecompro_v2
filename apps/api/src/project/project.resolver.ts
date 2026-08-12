import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProjectInput, ProjectModel } from '../graphql/models';
import { ProjectService } from './project.service';

@Resolver(() => ProjectModel)
export class ProjectResolver {
  constructor(private readonly projects: ProjectService) {}

  @Mutation(() => ProjectModel)
  createProject(@Args('input') input: CreateProjectInput) {
    return this.projects.create(
      input.organizationId,
      input.name,
      input.slug
    );
  }

  @Query(() => ProjectModel)
  project(@Args('id') id: string) {
    return this.projects.getById(id);
  }

  @Query(() => [ProjectModel])
  projectsByOrganization(@Args('organizationId') organizationId: string) {
    return this.projects.listByOrganization(organizationId);
  }
}
