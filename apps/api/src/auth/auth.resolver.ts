import { UseGuards } from '@nestjs/common';
import { Args, Field, ID, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ProjectModel, UpdateProfileInput } from '../graphql/models';
import { AuthService } from './auth.service';
import { CurrentUser, type AuthUser } from './auth.types';
import { JwtAuthGuard } from './jwt-auth.guard';

@InputType()
class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class AuthUserModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  role?: string | null;

  @Field(() => ID, { nullable: true })
  organizationId?: string | null;

  @Field(() => String, { nullable: true })
  organizationName?: string | null;
}

@ObjectType()
class AuthPayloadModel {
  @Field()
  token: string;

  @Field(() => AuthUserModel)
  user: AuthUserModel;
}

@ObjectType()
class MyProjectModel extends ProjectModel {
  @Field(() => String, { nullable: true })
  organizationName?: string | null;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => AuthPayloadModel)
  login(@Args('input') input: LoginInput) {
    return this.auth.login(input.email, input.password);
  }

  @Query(() => AuthUserModel)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.userId);
  }

  @Mutation(() => AuthUserModel)
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdateProfileInput
  ) {
    return this.auth.updateProfile(user.userId, input.name);
  }

  @Query(() => [MyProjectModel])
  @UseGuards(JwtAuthGuard)
  async myProjects(@CurrentUser() user: AuthUser): Promise<MyProjectModel[]> {
    const projects = await this.auth.myProjects(user.userId);
    return projects.map((project) => ({
      id: project.id,
      organizationId: project.organizationId,
      name: project.name,
      slug: project.slug,
      organizationName: project.organization.name,
    }));
  }
}
