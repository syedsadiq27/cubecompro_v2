'use client';

import { PageHeader } from '@repo/ui';

export default function SettingsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Platform Settings"
          description="Global cloud regions, default rate limits, webhook endpoints, and security compliance."
        />

        <div className="p-6 max-w-3xl space-y-6">
          {/* General Platform Environment */}
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
              Global Platform Configuration
            </h3>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--text-muted)]">Active Region</span>
                <span className="font-mono text-[var(--ink)]">us-east-1 (N. Virginia)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--text-muted)]">Failover Cluster</span>
                <span className="font-mono text-[var(--ink)]">eu-west-1 (Frankfurt)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--text-muted)]">Default Rate Limit</span>
                <span className="font-mono text-[var(--ink)]">1,000 req / min</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Webhook Timeout</span>
                <span className="font-mono text-[var(--ink)]">10,000 ms</span>
              </div>
            </div>
          </div>

          {/* Security & Authentication Policy */}
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
              Security &amp; Session Policies
            </h3>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--text-muted)]">Admin Session Max Age</span>
                <span className="font-mono text-[var(--ink)]">8 hours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--text-muted)]">MFA Requirement</span>
                <span className="font-medium text-[var(--ink)]">Enforced for all admin roles</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Audit Retention</span>
                <span className="font-mono text-[var(--ink)]">365 days (Immutable S3 WORM)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
