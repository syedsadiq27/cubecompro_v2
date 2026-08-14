import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthUser } from './auth.types';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: { user?: AuthUser } }>().req.user;
    if (user?.roleName !== 'owner') {
      throw new ForbiddenException('Owner role required');
    }
    return true;
  }
}
