'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  Field,
  Input,
  Select,
  useToast,
} from '@repo/ui';
import {
  CloseIcon,
  DragHandleIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
} from '@/components/bo/icons';
import { RowActionMenu } from '@/components/bo';
import type { GraphDetail } from '@/lib/product-workspace';

type RuleItem = {
  id: string;
  priority: number;
  ifCondition: string;
  thenAction: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
  updatedDate: string;
  updatedTime: string;
};

const DEFAULT_RULES: RuleItem[] = [
  {
    id: 'rule_01HZY8Q9K3W5YD8M7F2JOH3B1',
    priority: 1,
    ifCondition: 'Material = Leather',
    thenAction: 'Color ≠ White',
    description: 'White is not available for leather material.',
    status: 'Active',
    createdDate: 'Apr 28, 2025 9:11 AM',
    updatedDate: 'May 14, 2025',
    updatedTime: '10:24 AM',
  },
];

export function RulesTab({
  projectId,
  productId,
  detail,
  editable,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
}) {
  const toast = useToast();
  const [rules, setRules] = useState<RuleItem[]>(DEFAULT_RULES);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(DEFAULT_RULES[0]?.id ?? null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('Active');

  // Dialogs
  const [addRuleOpen, setAddRuleOpen] = useState(false);
  const [editRuleTarget, setEditRuleTarget] = useState<RuleItem | null>(null);

  // Form states
  const [newIf, setNewIf] = useState('Material = Leather');
  const [newThen, setNewThen] = useState('Color ≠ White');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState(1);

  // Edit states
  const [editIf, setEditIf] = useState('');
  const [editThen, setEditThen] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState(1);

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    body: string;
    onConfirm: () => void;
  }>({ open: false, title: '', body: '', onConfirm: () => {} });

  const activeCount = rules.filter((r) => r.status === 'Active').length;
  const inactiveCount = rules.filter((r) => r.status === 'Inactive').length;

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        r.description.toLowerCase().includes(q) ||
        r.ifCondition.toLowerCase().includes(q) ||
        r.thenAction.toLowerCase().includes(q)
      );
    });
  }, [rules, statusFilter, query]);

  const selectedRule = rules.find((r) => r.id === selectedRuleId) ?? null;

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: RuleItem = {
      id: `rule_${Date.now()}`,
      priority: newPriority,
      ifCondition: newIf.trim(),
      thenAction: newThen.trim(),
      description: newDesc.trim() || `${newIf} → ${newThen}`,
      status: 'Active',
      createdDate: 'Just now',
      updatedDate: 'May 14, 2025',
      updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setRules((prev) => [...prev, newRule]);
    setSelectedRuleId(newRule.id);
    setAddRuleOpen(false);
    setNewDesc('');
    toast.success('Rule created');
  };

  const handleEditRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRuleTarget) return;

    setRules((prev) =>
      prev.map((r) =>
        r.id === editRuleTarget.id
          ? {
              ...r,
              ifCondition: editIf.trim() || r.ifCondition,
              thenAction: editThen.trim() || r.thenAction,
              description: editDesc.trim() || r.description,
              priority: editPriority,
              updatedDate: 'Just now',
              updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : r
      )
    );
    setEditRuleTarget(null);
    toast.success('Rule updated');
  };

  const handleDeleteRule = (rule: RuleItem) => {
    setConfirmDialog({
      open: true,
      title: 'Delete configuration rule?',
      body: `This permanently deletes the rule “${rule.description}”. Option compatibility checks will no longer enforce this restriction.`,
      onConfirm: () => {
        setRules((prev) => prev.filter((r) => r.id !== rule.id));
        if (selectedRuleId === rule.id) setSelectedRuleId(null);
        setConfirmDialog((d) => ({ ...d, open: false }));
        toast.success('Rule deleted');
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* Left Main Workspace Area (~8 cols) */}
      <div className="space-y-4 lg:col-span-8">
        {/* Top Header & Counters */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-1">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--ink)]">Rules</h2>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Define which option combinations are valid.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-[14px] font-semibold font-mono text-[var(--ink)]">{activeCount}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Active</p>
              </div>
              <div>
                <p className="text-[14px] font-semibold font-mono text-[var(--text-muted)]">{inactiveCount}</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Inactive</p>
              </div>
              <div>
                <p className="text-[14px] font-semibold font-mono text-[var(--text-muted)]">0</p>
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Conflicting</p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setAddRuleOpen(true)}
              className="ui:flex ui:items-center ui:gap-1.5 ui:h-8 ui:px-3 ui:rounded-lg ui:bg-[var(--ink)] ui:hover:bg-black ui:text-white ui:text-[12px] ui:font-medium ui:shadow-xs"
            >
              <PlusIcon size={14} />
              <span>Add rule</span>
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <SearchIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-[1]"
            />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rules..."
              className="ui:h-8 ui:pl-8 ui:pr-3 ui:text-[12px]"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')
            }
            className="ui:h-8 ui:w-auto ui:min-w-[140px] ui:text-[12px]"
          >
            <option value="Active">Status: Active</option>
            <option value="Inactive">Status: Inactive</option>
            <option value="All">Status: All</option>
          </Select>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => toast.info('Additional rule filters')}
            className="ui:h-8 ui:text-[12px] ui:text-[var(--text-secondary)]"
          >
            More filters
          </Button>
        </div>

        {/* Rules Table */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
          <DataTable
            variant="fill"
            minWidth={720}
            footer={
              <div className="p-3 border-t border-[var(--line)] text-[12px] text-[var(--text-muted)]">
                Showing {filteredRules.length} of {rules.length}{' '}
                {rules.length === 1 ? 'rule' : 'rules'}
              </div>
            }
          >
            <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              <tr>
                <DataTable.HeaderCell className="w-8 pl-4 pr-1" />
                <DataTable.HeaderCell>Priority</DataTable.HeaderCell>
                <DataTable.HeaderCell>Rule</DataTable.HeaderCell>
                <DataTable.HeaderCell>Description</DataTable.HeaderCell>
                <DataTable.HeaderCell>Status</DataTable.HeaderCell>
                <DataTable.HeaderCell>Updated</DataTable.HeaderCell>
                <DataTable.HeaderCell align="right" className="pr-4 pl-2">
                  Actions
                </DataTable.HeaderCell>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {filteredRules.length === 0 ? (
                <DataTable.Row>
                  <DataTable.Cell
                    colSpan={7}
                    className="p-6 text-center text-[13px] text-[var(--text-muted)]"
                  >
                    No rules match your filters.
                  </DataTable.Cell>
                </DataTable.Row>
              ) : (
                filteredRules.map((rule) => {
                  const isSelected = selectedRuleId === rule.id;
                  return (
                    <DataTable.Row
                      key={rule.id}
                      selected={isSelected}
                      onClick={() => setSelectedRuleId(rule.id)}
                    >
                      <DataTable.Cell className="w-8 pl-4 pr-1 text-center text-[var(--text-muted)] cursor-grab">
                        <DragHandleIcon size={14} />
                      </DataTable.Cell>

                      <DataTable.Cell className="font-mono text-[13px]">
                        {rule.priority}
                      </DataTable.Cell>

                      <DataTable.Cell>
                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans font-semibold text-[10px] text-[var(--text-muted)] uppercase">
                              IF
                            </span>
                            <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 text-[var(--ink)] border border-[var(--line)]">
                              {rule.ifCondition}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans font-semibold text-[10px] text-[var(--text-muted)] uppercase">
                              THEN
                            </span>
                            <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 text-[var(--ink)] border border-[var(--line)]">
                              {rule.thenAction}
                            </span>
                          </div>
                        </div>
                      </DataTable.Cell>

                      <DataTable.Cell className="text-[12px] text-[var(--text-secondary)]">
                        {rule.description}
                      </DataTable.Cell>

                      <DataTable.Cell>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-200/60">
                          {rule.status}
                        </span>
                      </DataTable.Cell>

                      <DataTable.DateCell
                        date={rule.updatedDate}
                        time={rule.updatedTime}
                      />

                      <DataTable.ActionsCell className="pr-4 pl-2">
                        <RowActionMenu
                          label="Rule actions"
                          items={[
                            {
                              id: 'inspect',
                              label: isSelected ? 'Close details' : 'Inspect rule',
                              onClick: () =>
                                setSelectedRuleId((c) => (c === rule.id ? null : rule.id)),
                            },
                            {
                              id: 'edit',
                              label: 'Edit rule',
                              onClick: () => {
                                setEditRuleTarget(rule);
                                setEditIf(rule.ifCondition);
                                setEditThen(rule.thenAction);
                                setEditDesc(rule.description);
                                setEditPriority(rule.priority);
                              },
                            },
                            {
                              id: 'delete',
                              label: 'Delete rule',
                              danger: true,
                              separatorBefore: true,
                              onClick: () => handleDeleteRule(rule),
                            },
                          ]}
                        />
                      </DataTable.ActionsCell>
                    </DataTable.Row>
                  );
                })
              )}
            </DataTable.Body>
          </DataTable>
        </div>
      </div>

      {/* Right Inspector Drawer (~4 cols / 340px) */}
      <div className="lg:col-span-4">
        {selectedRule ? (
          <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden divide-y divide-[var(--line)]">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-[var(--ink)]">Rule details</h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-200/60">
                      {selectedRule.status}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                    ID: {selectedRule.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRuleId(null)}
                  aria-label="Close rule details"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="flex-1 ui:h-8 ui:text-[12px]"
                onClick={() => {
                  setEditRuleTarget(selectedRule);
                  setEditIf(selectedRule.ifCondition);
                  setEditThen(selectedRule.thenAction);
                  setEditDesc(selectedRule.description);
                  setEditPriority(selectedRule.priority);
                }}
              >
                <PencilIcon size={13} className="mr-1 inline" />
                <span>Edit rule</span>
              </Button>
              <button
                type="button"
                aria-label="More"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] hover:bg-[var(--canvas)]"
                onClick={() => handleDeleteRule(selectedRule)}
              >
                <MoreHorizontalIcon size={15} />
              </button>
            </div>

            {/* Summary */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Summary
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--text-secondary)]">Description</span>
                  <span className="text-right font-medium text-[var(--ink)]">
                    {selectedRule.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Created</span>
                  <span className="text-[var(--text-secondary)]">{selectedRule.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Updated</span>
                  <span className="text-[var(--text-secondary)]">
                    {selectedRule.updatedDate} {selectedRule.updatedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Priority</span>
                  <span className="font-mono font-medium text-[var(--ink)]">{selectedRule.priority}</span>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="p-4 space-y-2">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Conditions
              </h4>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-mono font-semibold text-[11px] text-[var(--text-muted)]">IF</span>
                <span className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/60 px-2.5 py-1.5 font-mono text-[12px] text-[var(--ink)]">
                  {selectedRule.ifCondition}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Actions
              </h4>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-mono font-semibold text-[11px] text-[var(--text-muted)]">THEN</span>
                <span className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/60 px-2.5 py-1.5 font-mono text-[12px] text-[var(--ink)]">
                  {selectedRule.thenAction}
                </span>
              </div>
            </div>

            {/* Scope */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Scope
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Applies to</span>
                  <span className="font-medium text-[var(--ink)]">This product only</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Evaluated in</span>
                  <span className="font-medium text-[var(--ink)]">Product configuration</span>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                  Activity
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ui:h-auto ui:px-0 ui:text-[11px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
                  onClick={() => toast.info('Viewing full activity')}
                >
                  View all
                </Button>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">Rule activated</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 14, 2025 10:24 AM by Demo Owner
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">Rule created</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Apr 28, 2025 9:11 AM by Demo Owner
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help? */}
            <div className="p-4 space-y-1.5 text-[12px] bg-[var(--canvas)]/30">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Need help?
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toast.info('Opening rules documentation')}
                className="ui:h-auto ui:justify-start ui:gap-1 ui:px-0 ui:text-[12px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
              >
                <span>Learn more about product rules</span>
                <ExternalLinkIcon size={12} />
              </Button>
            </div>
          </aside>
        ) : null}
      </div>

      {/* Add Rule Modal */}
      {addRuleOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--ink)]">New Rule</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                  Define a logic restriction between configuration options.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddRuleOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="mt-4 space-y-3.5">
              <Field label="IF Condition" htmlFor="new-rule-if">
                <Input
                  id="new-rule-if"
                  type="text"
                  required
                  placeholder="e.g. Material = Leather"
                  value={newIf}
                  onChange={(e) => setNewIf(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <Field label="THEN Action" htmlFor="new-rule-then">
                <Input
                  id="new-rule-then"
                  type="text"
                  required
                  placeholder="e.g. Color ≠ White"
                  value={newThen}
                  onChange={(e) => setNewThen(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <Field label="Description" htmlFor="new-rule-desc">
                <Input
                  id="new-rule-desc"
                  type="text"
                  placeholder="e.g. White is not available for leather material."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </Field>

              <Field label="Priority" htmlFor="new-rule-priority">
                <Input
                  id="new-rule-priority"
                  type="number"
                  min={1}
                  value={newPriority}
                  onChange={(e) => setNewPriority(Number(e.target.value))}
                  className="ui:w-24 ui:font-mono ui:text-[12px]"
                />
              </Field>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAddRuleOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                >
                  Create rule
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Edit Rule Modal */}
      {editRuleTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--ink)]">Edit Rule</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                  Update rule logic and priority.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditRuleTarget(null)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleEditRule} className="mt-4 space-y-3.5">
              <Field label="IF Condition" htmlFor="edit-rule-if">
                <Input
                  id="edit-rule-if"
                  type="text"
                  required
                  value={editIf}
                  onChange={(e) => setEditIf(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <Field label="THEN Action" htmlFor="edit-rule-then">
                <Input
                  id="edit-rule-then"
                  type="text"
                  required
                  value={editThen}
                  onChange={(e) => setEditThen(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <Field label="Description" htmlFor="edit-rule-desc">
                <Input
                  id="edit-rule-desc"
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </Field>

              <Field label="Priority" htmlFor="edit-rule-priority">
                <Input
                  id="edit-rule-priority"
                  type="number"
                  min={1}
                  value={editPriority}
                  onChange={(e) => setEditPriority(Number(e.target.value))}
                  className="ui:w-24 ui:font-mono ui:text-[12px]"
                />
              </Field>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditRuleTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                >
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        body={confirmDialog.body}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((d) => ({ ...d, open: false }))}
      />
    </div>
  );
}
