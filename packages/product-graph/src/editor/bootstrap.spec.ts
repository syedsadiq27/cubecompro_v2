import { bootstrapProductEditor } from './bootstrap';
import type { GraphDetail } from '../graph/types';

jest.mock('../graphql/client.js', () => ({
  graphRequest: jest.fn(),
}));

import { graphRequest } from '../graphql/client.js';

const graphRequestMock = graphRequest as jest.MockedFunction<typeof graphRequest>;

function detailWithModels(
  models: GraphDetail['models']
): GraphDetail {
  return {
    id: 'rev-1',
    version: 1,
    status: 'DRAFT',
    choices: [],
    rules: [],
    constraints: [],
    models,
    visualEffects: [],
    variants: [],
  };
}

describe('bootstrapProductEditor asset pinning', () => {
  beforeEach(() => {
    graphRequestMock.mockReset();
  });

  it('loads exact objectAssetRevision document URL', async () => {
    graphRequestMock
      .mockResolvedValueOnce({
        product: { id: 'p1', name: 'Alder', key: 'alder' },
      })
      .mockResolvedValueOnce({
        productRevisionDetail: detailWithModels([
          {
            id: 'model-1',
            key: 'primary',
            name: 'Primary',
            assetId: 'asset-1',
            objectAssetRevisionId: 'rev-artifact-3',
            linkedAssets: [
              {
                id: 'link-root',
                role: 'OBJECT',
                key: 'root',
                assetRevisionId: 'rev-artifact-3',
              },
            ],
            targets: [],
          },
        ]),
      });

    const bundle = await bootstrapProductEditor({
      auth: {
        token: 't',
        apiUrl: 'http://api.test',
        productRevisionId: 'rev-1',
      },
      productId: 'p1',
      modelId: 'model-1',
    });

    expect(bundle.objectAssetRevisionId).toBe('rev-artifact-3');
    expect(bundle.modelUrl).toBe(
      'http://api.test/documents/object-revisions/rev-artifact-3'
    );
    expect(bundle.assets[0]?.id).toBe('rev-artifact-3');
  });

  it('fails explicitly when ProductModel is missing', async () => {
    graphRequestMock
      .mockResolvedValueOnce({
        product: { id: 'p1', name: 'Alder', key: 'alder' },
      })
      .mockResolvedValueOnce({
        productRevisionDetail: detailWithModels([]),
      });

    await expect(
      bootstrapProductEditor({
        auth: {
          token: 't',
          apiUrl: 'http://api.test',
          productRevisionId: 'rev-1',
        },
        productId: 'p1',
      })
    ).rejects.toThrow(/NOT_CONFIGURED/);
  });

  it('does not fall back to another model when modelId is unknown', async () => {
    graphRequestMock
      .mockResolvedValueOnce({
        product: { id: 'p1', name: 'Alder', key: 'alder' },
      })
      .mockResolvedValueOnce({
        productRevisionDetail: detailWithModels([
          {
            id: 'model-1',
            key: 'primary',
            name: 'Primary',
            assetId: 'asset-1',
            objectAssetRevisionId: 'rev-artifact-3',
            linkedAssets: [
              {
                id: 'link-root',
                role: 'OBJECT',
                key: 'root',
                assetRevisionId: 'rev-artifact-3',
              },
            ],
            targets: [],
          },
        ]),
      });

    await expect(
      bootstrapProductEditor({
        auth: {
          token: 't',
          apiUrl: 'http://api.test',
          productRevisionId: 'rev-1',
        },
        productId: 'p1',
        modelId: 'missing-model',
      })
    ).rejects.toThrow(/NOT_CONFIGURED/);
  });
});
