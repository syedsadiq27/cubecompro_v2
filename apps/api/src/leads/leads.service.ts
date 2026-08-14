import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isFunnelId, normalizeFunnel } from './funnel';
import { syncLeadStatusToSheet } from './sheet-sync';

@Injectable()
export class LeadsService {
  private readonly log = new Logger(LeadsService.name);

  constructor(private readonly prisma: PrismaService) {}

  listStatuses() {
    return this.prisma.leadFunnelStatus.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async setStatus(email: string, submittedAt: string, status: string) {
    const next = normalizeFunnel(status);
    const value = isFunnelId(next) ? next : 'new';
    const row = await this.prisma.leadFunnelStatus.upsert({
      where: { email_submittedAt: { email, submittedAt } },
      create: { email, submittedAt, status: value },
      update: { status: value },
    });
    try {
      await syncLeadStatusToSheet({
        email,
        submittedAt,
        status: value,
      });
    } catch (error) {
      this.log.warn(
        error instanceof Error ? error.message : 'Sheet sync failed'
      );
    }
    return row;
  }
}
