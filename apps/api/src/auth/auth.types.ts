import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type AuthUser = {
  userId: string;
  email: string;
  organizationId: string;
  roleId: string;
  roleName: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: { user?: AuthUser } }>().req.user;
  }
);
