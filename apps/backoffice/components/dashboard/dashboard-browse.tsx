'use client';

import {
  AttentionCard,
  AttentionItem,
  BackofficePageHeader,
  BoxIcon,
  CatalogProgressCard,
  ConfigurationSessionsChart,
  GridIcon,
  LayersIcon,
  LinkIcon,
  MetricCard,
  MetricGrid,
  PageBody,
  PlusIcon,
  ProgressItem,
  QuickActionsCard,
  RecentActivityCard,
  ActivityItem,
  StoreIcon,
  TopProductsCard,
  TopProductItem,
} from '@/components/bo';
import { Button } from '@repo/ui';
import Link from 'next/link';

export function DashboardBrowse({
  projectId,
  productCount,
}: {
  projectId: string;
  productCount: number;
}) {
  const activeProducts = productCount > 0 ? productCount : 126;

  // 1. Attention Queue
  const attentionItems: AttentionItem[] = [
    {
      id: 'att-1',
      title: '3 products missing commerce mapping',
      description: 'Mapping required to go live in 2 channels',
      severity: 'high',
      severityLabel: 'High',
      href: `/${projectId}/commerce/mappings`,
    },
    {
      id: 'att-2',
      title: '2 draft configurations need review',
      description: 'Awaiting approval for publishing',
      severity: 'medium',
      severityLabel: 'Medium',
      href: `/${projectId}/products?status=draft`,
    },
    {
      id: 'att-3',
      title: '1 asset set incomplete',
      description: 'Missing required assets',
      severity: 'medium',
      severityLabel: 'Medium',
      href: `/${projectId}/library`,
    },
    {
      id: 'att-4',
      title: '0 failed syncs',
      description: 'All integrations healthy',
      severity: 'good',
      severityLabel: 'Good',
      href: `/${projectId}/settings/cms`,
    },
  ];

  // 2. Catalog Progress Items
  const progressItems: ProgressItem[] = [
    {
      id: 'prog-products',
      name: 'Products',
      current: activeProducts,
      total: 150,
      percentage: 84,
    },
    {
      id: 'prog-assets',
      name: 'Assets',
      current: 4320,
      total: 5000,
      percentage: 86,
    },
    {
      id: 'prog-configs',
      name: 'Configurations',
      current: 231,
      total: 300,
      percentage: 77,
    },
    {
      id: 'prog-channels',
      name: 'Channels',
      current: 7,
      total: 10,
      percentage: 70,
    },
  ];

  // 3. Recent Activities
  const recentActivities: ActivityItem[] = [
    {
      id: 'act-1',
      icon: <BoxIcon size={14} />,
      title: 'Product "Urban Sofa" published to Webstore',
      subtitle: 'Channel: Webstore',
      time: '2h ago',
      href: `/${projectId}/products`,
    },
    {
      id: 'act-2',
      icon: <LayersIcon size={14} />,
      title: 'Configuration "Leather - Walnut" approved',
      subtitle: 'By Jane Cooper',
      time: '5h ago',
      href: `/${projectId}/products`,
    },
    {
      id: 'act-3',
      icon: <GridIcon size={14} />,
      title: 'Assets imported for "Outdoor Dining Set"',
      subtitle: '24 new assets',
      time: '1d ago',
      href: `/${projectId}/library`,
    },
    {
      id: 'act-4',
      icon: <LinkIcon size={14} />,
      title: 'Commerce mapping created for "Dining Table"',
      subtitle: 'Mapped to Shopify',
      time: '1d ago',
      href: `/${projectId}/commerce/mappings`,
    },
    {
      id: 'act-5',
      icon: <StoreIcon size={14} />,
      title: 'Channel "Partner Portal" went live',
      subtitle: 'Environment: Production',
      time: '2d ago',
      href: `/${projectId}/settings/commerce`,
    },
  ];

  // 4. Top Products Table
  const topProducts: TopProductItem[] = [
    {
      id: 'prod_top_1',
      name: 'Urban Sofa',
      code: 'PRD-1001',
      status: 'published',
      statusLabel: 'Published',
      imageUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop&q=80',
      configMapped: 12,
      configTotal: 12,
      commerceMapped: 2,
      commerceTotal: 2,
      updatedDate: 'May 14, 2025',
      updatedTime: '2h ago',
    },
    {
      id: 'prod_top_2',
      name: 'Lounge Chair',
      code: 'PRD-1002',
      status: 'published',
      statusLabel: 'Published',
      imageUrl:
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=120&auto=format&fit=crop&q=80',
      configMapped: 8,
      configTotal: 10,
      commerceMapped: 1,
      commerceTotal: 2,
      updatedDate: 'May 14, 2025',
      updatedTime: '4h ago',
    },
    {
      id: 'prod_top_3',
      name: 'Dining Table',
      code: 'PRD-1003',
      status: 'draft',
      statusLabel: 'Draft',
      imageUrl:
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=120&auto=format&fit=crop&q=80',
      configMapped: 6,
      configTotal: 8,
      commerceMapped: 0,
      commerceTotal: 2,
      updatedDate: 'May 13, 2025',
      updatedTime: '1d ago',
    },
    {
      id: 'prod_top_4',
      name: 'Outdoor Dining Set',
      code: 'PRD-1004',
      status: 'published',
      statusLabel: 'Published',
      imageUrl:
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=120&auto=format&fit=crop&q=80',
      configMapped: 10,
      configTotal: 10,
      commerceMapped: 2,
      commerceTotal: 2,
      updatedDate: 'May 13, 2025',
      updatedTime: '1d ago',
    },
    {
      id: 'prod_top_5',
      name: 'Table Lamp',
      code: 'PRD-1005',
      status: 'draft',
      statusLabel: 'Draft',
      imageUrl:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=120&auto=format&fit=crop&q=80',
      configMapped: 4,
      configTotal: 6,
      commerceMapped: 0,
      commerceTotal: 1,
      updatedDate: 'May 12, 2025',
      updatedTime: '2d ago',
    },
    {
      id: 'prod_top_6',
      name: 'Platform Bed',
      code: 'PRD-1006',
      status: 'published',
      statusLabel: 'Published',
      imageUrl:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=120&auto=format&fit=crop&q=80',
      configMapped: 9,
      configTotal: 9,
      commerceMapped: 1,
      commerceTotal: 1,
      updatedDate: 'May 12, 2025',
      updatedTime: '2d ago',
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      {/* Page Header */}
      <BackofficePageHeader
        title="Dashboard"
        description="Overview"
        actions={
          <BackofficePageHeader.Actions
            primary={
              <Button
                as={Link}
                href={`/${projectId}/products/new`}
                size="sm"
                className="ui:flex ui:items-center ui:gap-1.5 ui:h-9 ui:px-3.5 ui:rounded-lg ui:bg-[var(--ink)] ui:hover:bg-black ui:text-white ui:text-[13px] ui:font-medium ui:shadow-xs"
              >
                <PlusIcon size={15} />
                <span>New product</span>
              </Button>
            }
          />
        }
      />

      {/* Main Dashboard Scroll Area */}
      <PageBody>
        <div className="space-y-4 pb-8">
          {/* Top KPI Metrics Row (5 cards) */}
          <MetricGrid>
            <MetricCard
              icon={<BoxIcon size={18} />}
              title="Active products"
              value={activeProducts}
              trend="↑ 12%"
              trendDirection="up"
              href={`/${projectId}/products`}
            />
            <MetricCard
              icon={<GridIcon size={18} />}
              title="Configurable products"
              value={98}
              trend="↑ 8%"
              trendDirection="up"
              href={`/${projectId}/products`}
            />
            <MetricCard
              icon={<LayersIcon size={18} />}
              title="Assets coverage"
              value="87%"
              trend="↑ 5%"
              trendDirection="up"
              href={`/${projectId}/library`}
            />
            <MetricCard
              icon={<LinkIcon size={18} />}
              title="Commerce mappings pending"
              value={3}
              trend="↓ 25%"
              trendDirection="down"
              href={`/${projectId}/commerce/mappings`}
            />
            <MetricCard
              icon={<StoreIcon size={18} />}
              title="Live channels"
              value={7}
              trend="↑ 1"
              trendDirection="up"
              href={`/${projectId}/settings/commerce`}
            />
          </MetricGrid>

          {/* Middle Row (3 cards) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AttentionCard items={attentionItems} />
            <CatalogProgressCard items={progressItems} />
            <RecentActivityCard
              viewAllHref={`/${projectId}/workflow`}
              items={recentActivities}
            />
          </div>

          {/* Bottom Row (Top Products & Chart/Actions) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Top Products Table (7 cols) */}
            <div className="lg:col-span-7">
              <TopProductsCard
                projectId={projectId}
                viewAllHref={`/${projectId}/products`}
                products={topProducts}
              />
            </div>

            {/* Right Column: Chart + Quick Actions (5 cols) */}
            <div className="space-y-4 lg:col-span-5">
              <ConfigurationSessionsChart />
              <QuickActionsCard projectId={projectId} />
            </div>
          </div>
        </div>
      </PageBody>
    </div>
  );
}
