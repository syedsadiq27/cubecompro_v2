import { AccessToggles } from '@/components/access-toggles';
import { Panel } from '@/components/panel';
import { StateLabel } from '@/components/state-label';
import { loadCatalog, loadResolved } from '@/lib/api';
import { sourceLabel } from '@/lib/format';

export default async function OrganizationEntitlementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [resolved, catalog] = await Promise.all([
    loadResolved(id),
    loadCatalog(),
  ]);

  return (
    <div className="space-y-4">
      <Panel title="Applications">
        <AccessToggles
          organizationId={id}
          applications={catalog.applications}
          capabilities={resolved.capabilities}
          planName={resolved.planName}
        />
      </Panel>
      {catalog.applications.map((app) => {
        const caps = resolved.capabilities.filter(
          (row) => row.application === app.id
        );
        if (caps.length === 0) return null;
        return (
          <Panel key={app.id} title={app.label}>
            <table className="w-full text-left text-[13px]">
              <thead className="type-meta">
                <tr>
                  <th className="py-1 font-medium">Capability</th>
                  <th className="py-1 font-medium">Key</th>
                  <th className="py-1 font-medium">State</th>
                  <th className="py-1 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {caps.map((row) => (
                  <tr key={row.key} className="border-t border-[var(--line)]">
                    <td className="py-2">{row.label}</td>
                    <td className="py-2 font-mono text-[12px]">{row.key}</td>
                    <td className="py-2">
                      <StateLabel enabled={row.enabled} />
                    </td>
                    <td className="type-meta py-2">
                      {sourceLabel(row.source, resolved.planName)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        );
      })}
    </div>
  );
}
