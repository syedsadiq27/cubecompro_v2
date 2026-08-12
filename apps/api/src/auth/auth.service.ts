import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from './auth.types';

type AccessTokenPayload = {
  sub: string;
  email: string;
  organizationId: string;
  roleId: string;
  roleName: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  private jwtSecret(): string {
    return this.config.get<string>('JWT_SECRET') ?? 'cubecom-dev-secret';
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: { role: true },
          take: 1,
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const membership = user.memberships[0];
    if (!membership) {
      throw new UnauthorizedException('User has no organization membership');
    }

    const authUser: AuthUser = {
      userId: user.id,
      email: user.email,
      organizationId: membership.organizationId,
      roleId: membership.roleId,
      roleName: membership.role.name,
    };

    const token = jwt.sign(
      {
        sub: authUser.userId,
        email: authUser.email,
        organizationId: authUser.organizationId,
        roleId: authUser.roleId,
        roleName: authUser.roleName,
      } satisfies AccessTokenPayload,
      this.jwtSecret(),
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: membership.role.name,
        organizationId: membership.organizationId,
      },
    };
  }

  verifyAccessToken(token: string): AuthUser {
    try {
      const payload = jwt.verify(token, this.jwtSecret()) as AccessTokenPayload;
      return {
        userId: payload.sub,
        email: payload.email,
        organizationId: payload.organizationId,
        roleId: payload.roleId,
        roleName: payload.roleName,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: { role: true, organization: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const membership = user.memberships[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: membership?.role.name ?? null,
      organizationId: membership?.organizationId ?? null,
      organizationName: membership?.organization.name ?? null,
    };
  }

  async myProjects(userId: string) {
    const memberships = await this.prisma.organizationMembership.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const organizationIds = memberships.map((row) => row.organizationId);
    return this.prisma.project.findMany({
      where: { organizationId: { in: organizationIds } },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateProfile(userId: string, name?: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name } : {}),
      },
    });
    return this.me(user.id);
  }
}
