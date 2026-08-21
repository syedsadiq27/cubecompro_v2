import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, isAbsolute, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type StoredDocument = {
  /** Store-relative key (never file://, gs://, or host absolute path). */
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

  private normalizeRelativeKey(relative: string): string {
    return relative.replace(/^\/+/, '').replace(/\\/g, '/');
  }

  /**
   * Convert a DB store key or legacy absolute/file URI into a store-relative key.
   * Rejects path traversal and unresolved remote schemes.
   */
  toRelativeStoreKey(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (/^(gs|s3|https?):\/\//i.test(trimmed)) {
      return null;
    }

    if (trimmed.startsWith('file://') || isAbsolute(trimmed)) {
      let absolute: string;
      if (trimmed.startsWith('file://')) {
        try {
          absolute = fileURLToPath(trimmed);
        } catch {
          absolute = trimmed.slice('file://'.length);
        }
      } else {
        absolute = trimmed;
      }
      if (!isAbsolute(absolute)) {
        absolute = resolve(process.cwd(), absolute);
      }
      const root = this.rootDir();
      const resolved = resolve(absolute);
      if (resolved === root || resolved.startsWith(root + sep)) {
        return this.normalizeRelativeKey(resolved.slice(root.length));
      }
      const assetsMatch = resolved.match(
        /(?:^|[/\\])(assets[/\\]sha256[/\\][^/\\?#]+)$/
      );
      if (assetsMatch) {
        return this.normalizeRelativeKey(assetsMatch[1]);
      }
      const documentsMatch = resolved.match(
        /[/\\](?:\.data[/\\])?documents[/\\](.+)$/
      );
      if (documentsMatch) {
        return this.normalizeRelativeKey(documentsMatch[1]);
      }
      return null;
    }

    const normalized = this.normalizeRelativeKey(trimmed);
    if (!normalized || normalized.split('/').includes('..')) {
      return null;
    }
    return normalized;
  }

  async putJson(
    keyPath: string,
    payload: unknown
  ): Promise<StoredDocument> {
    const body = JSON.stringify(payload);
    const sha256 = createHash('sha256').update(body).digest('hex');
    const relative = this.normalizeRelativeKey(keyPath);
    const absolute = join(this.rootDir(), relative);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, body, 'utf8');
    return {
      uri: relative,
      sha256,
    };
  }

  async putBytes(
    keyPath: string,
    bytes: Buffer
  ): Promise<StoredDocument> {
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const relative = this.normalizeRelativeKey(keyPath);
    const absolute = join(this.rootDir(), relative);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, bytes);
    return {
      uri: relative,
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
      uri: relative,
      sha256,
    };
  }

  resolveAbsolutePath(storeKeyOrLegacyUri: string): string | null {
    const relative = this.toRelativeStoreKey(storeKeyOrLegacyUri);
    if (!relative) return null;
    const root = this.rootDir();
    const absolute = resolve(root, relative);
    if (absolute !== root && !absolute.startsWith(root + sep)) {
      return null;
    }
    return absolute;
  }

  async readBytes(storeKeyOrLegacyUri: string): Promise<Buffer | null> {
    const absolute = this.resolveAbsolutePath(storeKeyOrLegacyUri);
    if (!absolute) return null;
    try {
      return await readFile(absolute);
    } catch {
      return null;
    }
  }
}
