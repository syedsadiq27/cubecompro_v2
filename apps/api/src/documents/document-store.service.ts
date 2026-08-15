import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, isAbsolute, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
    const configured = this.config.get<string>('DOCUMENT_STORE_PATH')?.trim();
    if (!configured) {
      return join(process.cwd(), '.data', 'documents');
    }
    return isAbsolute(configured)
      ? configured
      : resolve(process.cwd(), configured);
  }

  private toFileUri(absolute: string): string {
    return pathToFileURL(absolute).href;
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
      uri: this.toFileUri(absolute),
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
      uri: this.toFileUri(absolute),
      sha256,
    };
  }

  /**
   * Content-addressed immutable store. Same bytes → same path (idempotent).
   * Never overwrites existing bytes with different content.
   * Always writes under DOCUMENT_STORE_PATH (local disk in dev).
   */
  async putImmutableBytes(
    bytes: Buffer,
    extension: string
  ): Promise<StoredDocument> {
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const ext = extension.replace(/^\./, '') || 'bin';
    const relative = `assets/sha256/${sha256}.${ext}`;
    const absolute = join(this.rootDir(), relative);
    await mkdir(dirname(absolute), { recursive: true });
    try {
      await access(absolute, constants.F_OK);
      const existing = await readFile(absolute);
      const existingHash = createHash('sha256').update(existing).digest('hex');
      if (existingHash !== sha256) {
        throw new Error(
          `Immutable artifact collision at ${relative}: content hash mismatch`
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Immutable artifact collision')
      ) {
        throw error;
      }
      await writeFile(absolute, bytes);
    }
    return {
      uri: this.toFileUri(absolute),
      sha256,
    };
  }

  resolveAbsolutePath(fileUri: string): string | null {
    if (!fileUri.startsWith('file://')) return null;
    let absolute: string;
    try {
      absolute = fileURLToPath(fileUri);
    } catch {
      absolute = fileUri.slice('file://'.length);
    }
    if (!isAbsolute(absolute)) {
      absolute = resolve(process.cwd(), absolute);
    }
    const root = this.rootDir();
    const resolved = resolve(absolute);
    if (resolved !== root && !resolved.startsWith(root + sep)) {
      return null;
    }
    return resolved;
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
