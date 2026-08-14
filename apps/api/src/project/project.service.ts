import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntitlementService } from '../entitlements/entitlement.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementService
  ) {}

  async create(organizationId: string, name: string, slug: string) {
    const allowed = await this.entitlements.can(
      organizationId,
      'backoffice.products'
    );
    if (!allowed) {
      throw new ForbiddenException('Missing capability backoffice.products');
    }

    const limit = await this.entitlements.getLimit(
      organizationId,
      'limits.projects'
    );
    const count = await this.prisma.project.count({ where: { organizationId } });
    if (limit > 0 && count >= limit) {
      throw new ForbiddenException(
        `Organization limit limits.projects (${limit}) reached`
      );
    }

    return this.prisma.project.create({
      data: { organizationId, name, slug },
    });
  }

  async getById(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  listByOrganization(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
