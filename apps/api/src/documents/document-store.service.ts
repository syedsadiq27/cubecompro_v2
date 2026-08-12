import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type StoredDocument = {
  uri: string;
  sha256: string;
};

@Injectable()
export class DocumentStoreService {
  constructor(private readonly config: ConfigService) {}

  private rootDir(): string {
    return (
      this.config.get<string>('DOCUMENT_STORE_PATH') ??
      join(process.cwd(), '.data', 'documents')
    );
  }

  async putJson(
    keyPath: string,
    payload: unknown
  ): Promise<StoredDocument> {
    const body = JSON.stringify(payload);
    const sha256 = createHash('sha256').update(body).digest('hex');
    const relative = keyPath.replace(/^\/+/, '');
    const absolute = join(this.rootDir(), relative);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, body, 'utf8');
    return {
      uri: `file://${absolute}`,
      sha256,
    };
  }

  async putBytes(
    keyPath: string,
    bytes: Buffer
  ): Promise<StoredDocument> {
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const relative = keyPath.replace(/^\/+/, '');
    const absolute = join(this.rootDir(), relative);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, bytes);
    return {
      uri: `file://${absolute}`,
      sha256,
    };
  }

  resolveAbsolutePath(fileUri: string): string | null {
    if (!fileUri.startsWith('file://')) return null;
    const absolute = fileUri.slice('file://'.length);
    const root = this.rootDir();
    if (!absolute.startsWith(root)) return null;
    return absolute;
  }

  async readBytes(fileUri: string): Promise<Buffer | null> {
    const absolute = this.resolveAbsolutePath(fileUri);
    if (!absolute) return null;
    try {
      return await readFile(absolute);
    } catch {
      return null;
    }
  }
}
