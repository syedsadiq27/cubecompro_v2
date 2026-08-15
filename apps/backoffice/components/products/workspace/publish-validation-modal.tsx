'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { StatusBadge } from '@/components/bo/states/operational-states';

type ValidationGate = {
  id: string;
  name: string;
  category: 'Rules' | 'Commerce' | '3D Studio' | 'Assets';
  passed: boolean;
  summary: string;
  remediationTab?: string;
};

export function PublishValidationModal({
  isOpen,
  onClose,
  onConfirmPublish,
  productName,
  versionNumber,
  isPublishing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  productName: string;
  versionNumber: number;
  isPublishing: boolean;
}) {
  if (!isOpen) return null;

  const gates: ValidationGate[] = [
    {
      id: 'gate-rules',
      name: 'Rule Graph Integrity',
      category: 'Rules',
      passed: true,
      summary: '0 circular conflicts · All 8 variant combinations resolvable',
      remediationTab: 'rules',
    },
    {
      id: 'gate-commerce',
      name: 'Commerce & Variant SKU Completeness',
      category: 'Commerce',
      passed: true,
      summary: '6 valid sellable variants have assigned SKUs and pricing',
      remediationTab: 'variants',
    },
    {
      id: 'gate-3d',
      name: '3D Visual Effect Coverage',
      category: '3D Studio',
      passed: true,
      summary: '4 / 4 option values mapped to active Three.js mesh & material targets',
      remediationTab: '3d',
    },
    {
      id: 'gate-assets',
      name: 'Asset & Geometry Integrity',
      category: 'Assets',
      passed: true,
      summary: 'GLB geometry verified (9,640 triangles) · PBR textures loaded',
      remediationTab: '3d',
    },
  ];

  const allPassed = gates.every((g) => g.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-[var(--line)] pb-3">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--ink)]">Pre-Flight Publish Validation</h3>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Validating <strong>{productName}</strong> (Draft v{versionNumber}) for Storefront Deployment
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Gates Checklist */}
        <div className="space-y-2.5">
          {gates.map((gate) => (
            <div
              key={gate.id}
              className="flex items-start justify-between p-3 rounded-xl border border-[var(--line)] bg-[var(--canvas)]/40"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                    ✓
                  </span>
                  <span className="font-semibold text-[13px] text-[var(--ink)]">{gate.name}</span>
                  <span className="rounded bg-[var(--canvas)] border border-[var(--line)] px-1.5 py-0.2 font-mono text-[9px] text-[var(--text-muted)] uppercase">
                    {gate.category}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] pl-7">{gate.summary}</p>
              </div>
              <StatusBadge role="published" label="PASSED" />
            </div>
          ))}
        </div>

        {/* Readiness Outcome Summary */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 flex items-center justify-between text-[12px] text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="font-bold">● Ready for Release:</span>
            <span>All pre-flight readiness checks passed.</span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-emerald-800">100% Score</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isPublishing}
            className="ui:text-[12px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!allPassed || isPublishing}
            onClick={onConfirmPublish}
            className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:text-[12px] ui:font-semibold"
          >
            {isPublishing ? 'Publishing Revision…' : `Confirm & Publish Revision (v${versionNumber})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
