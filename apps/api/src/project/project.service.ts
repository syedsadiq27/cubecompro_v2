import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, name: string, slug: string) {
    const maxProjects = await this.prisma.organizationEntitlement.findUnique({
      where: {
        organizationId_key: { organizationId, key: 'maxProjects' },
      },
    });
    const limit =
      typeof maxProjects?.value === 'number'
        ? maxProjects.value
        : Number(maxProjects?.value ?? 5);

    const count = await this.prisma.project.count({ where: { organizationId } });
    if (count >= limit) {
      throw new ForbiddenException(
        `Organization entitlement maxProjects (${limit}) reached`
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
