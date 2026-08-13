import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL not found');
    }
    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
