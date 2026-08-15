'use client';

import { useState } from 'react';
import { Button, Field, Input, Select, useToast } from '@repo/ui';
import { assignPlanAction, createTenantAction } from '@/actions/tenants';

export function ChangePlanModal({
  isOpen,
  organizationId,
  organizationName,
  currentPlan = 'Starter',
  onClose,
}: {
  isOpen: boolean;
  organizationId: string;
  organizationName: string;
  currentPlan?: string;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      await assignPlanAction(organizationId, selectedPlan);
      showToast(`Assigned ${selectedPlan.toUpperCase()} plan to ${organizationName}`);
      onClose();
    } catch {
      showToast(`Failed to update plan`, 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 select-none animate-in fade-in duration-100">
      <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div>
            <h3 className="text-[15px] font-bold text-[var(--ink)]">Change Organization Plan</h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{organizationName}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            {[
              { id: 'starter', name: 'Starter', desc: '$49/mo · 1 product graph, 100k API calls' },
              { id: 'pro', name: 'Pro', desc: '$149/mo · 10 product graphs, 2M API calls, AR' },
              { id: 'enterprise', name: 'Enterprise', desc: 'Custom · Unlimited graphs, custom HDRI, SLA' },
            ].map((p) => (
              <label
                key={p.id}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                  selectedPlan === p.id
                    ? 'border-[var(--ink)] bg-[var(--canvas)]/60'
                    : 'border-[var(--line)] hover:bg-[var(--canvas)]/30'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlan === p.id}
                  onChange={() => setSelectedPlan(p.id)}
                  className="mt-0.5 accent-[var(--ink)]"
                />
                <div>
                  <p className="text-[13px] font-semibold text-[var(--ink)]">{p.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{p.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Saving…' : 'Update Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateTenantModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [planId, setPlanId] = useState('starter');
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      const res = await createTenantAction({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), planId });
      if (res.ok) {
        showToast(`Created organization ${name}`);
        onClose();
      } else {
        showToast(res.error || 'Failed to create organization', 'error');
      }
    } catch {
      showToast('Error creating organization', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 select-none animate-in fade-in duration-100">
      <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <h3 className="text-[15px] font-bold text-[var(--ink)]">Provision New Organization</h3>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Organization Name" htmlFor="tenant-name">
            <Input
              id="tenant-name"
              type="text"
              required
              placeholder="e.g. Acme Studio"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
            />
          </Field>

          <Field label="Tenant Key / Slug" htmlFor="tenant-slug">
            <Input
              id="tenant-slug"
              type="text"
              required
              placeholder="acme-studio"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="ui:font-mono"
            />
          </Field>

          <Field label="Initial Plan Tier" htmlFor="tenant-plan">
            <Select
              id="tenant-plan"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
            >
              <option value="starter">Starter ($49/mo)</option>
              <option value="pro">Pro ($149/mo)</option>
              <option value="enterprise">Enterprise (Custom)</option>
            </Select>
          </Field>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Provisioning…' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
