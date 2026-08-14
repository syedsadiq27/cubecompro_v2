import { PageHeader } from '@/components/page-header';
import { Panel } from '@/components/panel';
import { loadCatalog } from '@/lib/api';

export default async function EntitlementsPage() {
  const catalog = await loadCatalog();

  return (
    <>
      <PageHeader
        title="Entitlements"
        description="Canonical registry. Apps call can(fullKey). Never branch on plan name."
      />
      <div className="space-y-4">
        {catalog.applications.map((app) => {
          const capabilities = catalog.capabilities.filter(
            (row) => row.application === app.id
          );
          const limits = catalog.limits.filter(
            (row) => row.application === app.id
          );
          return (
            <Panel key={app.id} title={app.label}>
              <p className="type-meta mb-4 font-mono">
                application: {app.id}
                <span className="ml-3">gate: {app.gate}</span>
              </p>
              {capabilities.length > 0 ? (
                <div className="mb-5">
                  <h3 className="type-nav-label mb-2">Capabilities</h3>
                  <table className="w-full text-left text-[13px]">
                    <thead className="type-meta">
                      <tr>
                        <th className="py-1 font-medium">fullKey</th>
                        <th className="py-1 font-medium">key</th>
                        <th className="py-1 font-medium">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {capabilities.map((row) => (
                        <tr
                          key={row.key}
                          className="border-t border-[var(--line)]"
                        >
                          <td className="py-2 font-mono text-[12px]">
                            {row.key}
                          </td>
                          <td className="py-2 font-mono text-[12px]">
                            {row.shortKey}
                          </td>
                          <td className="py-2">{row.label}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {limits.length > 0 ? (
                <div>
                  <h3 className="type-nav-label mb-2">Limits</h3>
                  <table className="w-full text-left text-[13px]">
                    <thead className="type-meta">
                      <tr>
                        <th className="py-1 font-medium">fullKey</th>
                        <th className="py-1 font-medium">key</th>
                        <th className="py-1 font-medium">Label</th>
                        <th className="py-1 font-medium">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {limits.map((row) => (
                        <tr
                          key={row.key}
                          className="border-t border-[var(--line)]"
                        >
                          <td className="py-2 font-mono text-[12px]">
                            {row.key}
                          </td>
                          <td className="py-2 font-mono text-[12px]">
                            {row.shortKey}
                          </td>
                          <td className="py-2">{row.label}</td>
                          <td className="type-meta py-2">{row.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Panel>
          );
        })}
      </div>
    </>
  );
}
