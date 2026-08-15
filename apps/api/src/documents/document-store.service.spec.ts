import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { DocumentStoreService } from './document-store.service';

describe('DocumentStoreService putImmutableBytes', () => {
  let root: string;
  let store: DocumentStoreService;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'cube-docs-'));
    store = new DocumentStoreService({
      get: (key: string) =>
        key === 'DOCUMENT_STORE_PATH' ? root : undefined,
    } as ConfigService);
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('stores by content hash and is idempotent for identical bytes', async () => {
    const bytes = Buffer.from('glb-bytes-v1');
    const first = await store.putImmutableBytes(bytes, 'glb');
    const second = await store.putImmutableBytes(bytes, 'glb');
    expect(first.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
    expect(first.uri).toBe(second.uri);
    expect(first.uri).toContain(`/assets/sha256/${first.sha256}.glb`);
    const absolute = store.resolveAbsolutePath(first.uri);
    expect(absolute).toBeTruthy();
    expect(await readFile(absolute!)).toEqual(bytes);
  });

  it('does not mutate prior artifact when new bytes are stored', async () => {
    const oldBytes = Buffer.from('artifact-old');
    const newBytes = Buffer.from('artifact-new');
    const oldDoc = await store.putImmutableBytes(oldBytes, 'glb');
    const newDoc = await store.putImmutableBytes(newBytes, 'glb');
    expect(oldDoc.sha256).not.toBe(newDoc.sha256);
    expect(await readFile(store.resolveAbsolutePath(oldDoc.uri)!)).toEqual(
      oldBytes
    );
    expect(await readFile(store.resolveAbsolutePath(newDoc.uri)!)).toEqual(
      newBytes
    );
  });
});
