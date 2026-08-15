export { BackofficeShell, TopBar, useSidebarNavigate } from '@/components/bo/shell/backoffice-shell';
export {
  Sidebar,
  SidebarNav,
  WorkspaceSwitcher,
  SidebarSection,
  SidebarItem,
} from '@/components/bo/shell/sidebar';
export { AccountFooter } from '@/components/bo/shell/account-footer';

export {
  PageHeader,
  BackofficePageHeader,
  PageToolbar,
  ListChrome,
  PageBody,
  PageFrame,
} from '@/components/bo/page/page-header';

export {
  EntityTabs,
  EntityTab,
  MoreFiltersButton,
  ClearFiltersButton,
  ToolbarIconButton,
  ToolbarSettingsButton,
  ViewModeSwitcher,
} from '@/components/bo/filters/filter-bar';

export { Pagination, type PaginationProps } from '@/components/bo/table/pagination';

export {
  StatusBadge,
  AttentionState,
  EmptyState,
  ProcessingState,
  IncompleteConfigBanner,
  SuccessBanner,
  BulkActionBar,
  SkeletonRows,
  type EmptyStateVariant,
} from '@/components/bo/states/operational-states';

export {
  OverflowMenu,
  RowActionMenu,
  type OverflowMenuItem,
} from '@/components/bo/actions/overflow-menu';

export { InspectorActionCards } from '@/components/bo/inspector/inspector-panel';

export {
  MetricCard,
  MetricGrid,
} from '@/components/bo/dashboard/metric-card';
export {
  AttentionCard,
  type AttentionItem,
} from '@/components/bo/dashboard/attention-card';
export {
  CatalogProgressCard,
  type ProgressItem,
} from '@/components/bo/dashboard/catalog-progress-card';
export {
  RecentActivityCard,
  type ActivityItem,
} from '@/components/bo/dashboard/recent-activity-card';
export {
  TopProductsCard,
  type TopProductItem,
} from '@/components/bo/dashboard/top-products-card';
export { ConfigurationSessionsChart } from '@/components/bo/dashboard/configuration-sessions-chart';
export { QuickActionsCard } from '@/components/bo/dashboard/quick-actions-card';

export {
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  SwitchInput,
  RadioCard,
  InlineEditField,
} from '@/components/bo/forms/form-controls';

export {
  SectionHeader,
  DetailGrid,
  SplitPane,
  StickyActionBar,
} from '@/components/bo/layout/composition-primitives';

export {
  DetailRow,
  AccordionRow,
  FileUploadZone,
  AuditLogItem,
} from '@/components/bo/feedback/interaction-primitives';

export * from '@/components/bo/icons';
