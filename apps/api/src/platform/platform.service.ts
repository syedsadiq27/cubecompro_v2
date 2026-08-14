import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULTS: Array<{ app: string; key: string; value: string }> = [
  {
    app: 'api',
    key: 'publicUrl',
    value: process.env.API_PUBLIC_URL ?? 'http://localhost:3005',
  },
  {
    app: 'backoffice',
    key: 'publicUrl',
    value: 'http://localhost:3002',
  },
  {
    app: 'backoffice',
    key: 'apiUrl',
    value: process.env.API_PUBLIC_URL ?? 'http://localhost:3005',
  },
  { app: 'editor', key: 'publicUrl', value: 'http://localhost:3003' },
  {
    app: 'editor',
    key: 'apiUrl',
    value: process.env.API_PUBLIC_URL ?? 'http://localhost:3005',
  },
  { app: 'customizer', key: 'publicUrl', value: 'http://localhost:3001' },
  {
    app: 'customizer',
    key: 'apiUrl',
    value: process.env.API_PUBLIC_URL ?? 'http://localhost:3005',
  },
  { app: 'customizer', key: 'defaultProjectId', value: '' },
];

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  list(app?: string) {
    return this.prisma.platformSetting.findMany({
      where: app ? { app } : undefined,
      orderBy: [{ app: 'asc' }, { key: 'asc' }],
    });
  }

  async ensureDefaults() {
    for (const row of DEFAULTS) {
      await this.prisma.platformSetting.upsert({
        where: { app_key: { app: row.app, key: row.key } },
        create: row,
        update: {},
      });
    }
  }

  async upsert(app: string, key: string, value: string) {
    return this.prisma.platformSetting.upsert({
      where: { app_key: { app, key } },
      create: { app, key, value },
      update: { value },
    });
  }

  async upsertMany(rows: Array<{ app: string; key: string; value: string }>) {
    const result = [];
    for (const row of rows) {
      result.push(await this.upsert(row.app, row.key, row.value));
    }
    return result;
  }
}
