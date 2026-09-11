import {
  CommerceConnectionResolveError,
  resolveCommerceConnection,
} from './connection';

describe('resolveCommerceConnection', () => {
  it('prefers mapping override over project and organization defaults', () => {
    expect(
      resolveCommerceConnection({
        mappingConnectionId: 'conn-map',
        projectDefaultConnectionId: 'conn-project',
        organizationDefaultConnectionId: 'conn-org',
      })
    ).toBe('conn-map');
  });

  it('uses project default when mapping is absent', () => {
    expect(
      resolveCommerceConnection({
        projectDefaultConnectionId: 'conn-project',
        organizationDefaultConnectionId: 'conn-org',
      })
    ).toBe('conn-project');
  });

  it('uses organization default when mapping and project are absent', () => {
    expect(
      resolveCommerceConnection({
        organizationDefaultConnectionId: 'conn-org',
      })
    ).toBe('conn-org');
  });

  it('trims connection ids', () => {
    expect(
      resolveCommerceConnection({
        mappingConnectionId: '  conn-map  ',
      })
    ).toBe('conn-map');
  });

  it('treats blank strings as missing', () => {
    expect(
      resolveCommerceConnection({
        mappingConnectionId: '   ',
        organizationDefaultConnectionId: 'conn-org',
      })
    ).toBe('conn-org');
  });

  it('fails when no connection can be resolved', () => {
    expect(() => resolveCommerceConnection({})).toThrow(
      CommerceConnectionResolveError
    );
  });
});
