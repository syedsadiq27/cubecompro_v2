import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_ENTITLEMENTS: Record<string, Prisma.InputJsonValue> = {
  maxProjects: 5,
  maxUsers: 10,
  commerceAdapters: [],
  materialsEnabled: true,
  publicEmbedEnabled: true,
};

const DEFAULT_PERMISSIONS = [
  'organization.manage',
  'project.manage',
  'product.read',
  'product.write',
  'graph.publish',
  'library.write',
  'resolve.execute',
  'configuration.save',
] as const;

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, slug: string) {
    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: { name, slug },
      });

      for (const code of DEFAULT_PERMISSIONS) {
        await tx.permission.upsert({
          where: { code },
          create: { code },
          update: {},
        });
      }

      const permissions = await tx.permission.findMany({
        where: { code: { in: [...DEFAULT_PERMISSIONS] } },
      });

      const role = await tx.role.create({
        data: {
          organizationId: organization.id,
          name: 'owner',
          permissions: {
            create: permissions.map((permission) => ({
              permissionId: permission.id,
            })),
          },
        },
      });

      await tx.organizationEntitlement.createMany({
        data: Object.entries(DEFAULT_ENTITLEMENTS).map(([key, value]) => ({
          organizationId: organization.id,
          key,
          value,
        })),
      });

      const starter = await tx.plan.findUnique({ where: { key: 'starter' } });
      if (starter) {
        await tx.organization.update({
          where: { id: organization.id },
          data: { planId: starter.id, status: OrganizationStatus.TRIAL },
        });
      }

      return { organization, ownerRoleId: role.id };
    });
  }

  async getById(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException(`Organization ${id} not found`);
    }
    return organization;
  }

  async listEntitlements(organizationId: string) {
    return this.prisma.organizationEntitlement.findMany({
      where: { organizationId },
      orderBy: { key: 'asc' },
    });
  }

  async listMembers(organizationId: string) {
    await this.getById(organizationId);
    return this.prisma.organizationMembership.findMany({
      where: { organizationId },
      include: { user: true, role: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async listRoles(organizationId: string) {
    await this.getById(organizationId);
    return this.prisma.role.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
  }
}
