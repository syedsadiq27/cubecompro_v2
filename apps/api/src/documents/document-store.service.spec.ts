import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
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

  it('stores by content hash and persists a store-relative key', async () => {
    const bytes = Buffer.from('glb-bytes-v1');
    const first = await store.putImmutableBytes(bytes, 'glb');
    const second = await store.putImmutableBytes(bytes, 'glb');
    expect(first.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
    expect(first.uri).toBe(second.uri);
    expect(first.uri).toBe(`assets/sha256/${first.sha256}.glb`);
    expect(first.uri.startsWith('file://')).toBe(false);
    const absolute = store.resolveAbsolutePath(first.uri);
    expect(absolute).toBe(join(root, first.uri));
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

  it('resolves legacy file:// URIs under the store root', async () => {
    const bytes = Buffer.from('legacy-bytes');
    const relative = 'assets/sha256/legacy.glb';
    const absolute = join(root, relative);
    await mkdir(join(root, 'assets', 'sha256'), { recursive: true });
    await writeFile(absolute, bytes);
    const legacyUri = pathToFileURL(absolute).href;
    expect(store.toRelativeStoreKey(legacyUri)).toBe(relative);
    expect(store.resolveAbsolutePath(legacyUri)).toBe(absolute);
    expect(await store.readBytes(legacyUri)).toEqual(bytes);
  });

  it('rejects path traversal in relative keys', async () => {
    expect(store.toRelativeStoreKey('../outside.bin')).toBeNull();
    expect(store.resolveAbsolutePath('../outside.bin')).toBeNull();
  });
});
