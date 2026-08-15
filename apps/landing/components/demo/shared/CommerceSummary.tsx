'use client';

import {
  Button,
  Card,
  DescriptionList,
  Stack,
  Typography,
} from '@repo/ui';

type CommerceSummaryProps = {
  sku: string;
  price: number;
  inventory: number;
  configuration: string;
  copied: boolean;
  addedToCart: boolean;
  onCopyShareLink: () => void;
  onAddToCart: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function CommerceSummary({
  sku,
  price,
  inventory,
  configuration,
  copied,
  addedToCart,
  onCopyShareLink,
  onAddToCart,
}: CommerceSummaryProps) {
  const inStock = inventory > 0;

  return (
    <Stack gap="md">
      <Card padding="md">
        <Typography variant="label">Resolved state</Typography>
        <DescriptionList gap="sm" className="mt-4">
          <div className="flex items-baseline justify-between gap-4">
            <Typography as="dt" variant="meta" tone="muted">
              SKU
            </Typography>
            <Typography as="dd" variant="code" className="normal-case tracking-normal">
              {sku}
            </Typography>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <Typography as="dt" variant="meta" tone="muted">
              Price
            </Typography>
            <Typography as="dd" variant="title" className="text-lg">
              {formatPrice(price)}
            </Typography>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <Typography as="dt" variant="meta" tone="muted">
              Inventory
            </Typography>
            <Typography
              as="dd"
              variant="bodyStrong"
              className={
                inStock ? 'text-[var(--success)]' : 'text-[var(--danger)]'
              }
            >
              {inStock ? `• ${inventory} available` : 'Out of stock'}
            </Typography>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <Typography as="dt" variant="meta" tone="muted">
              Configuration
            </Typography>
            <Typography as="dd" variant="support" className="text-right">
              {configuration}
            </Typography>
          </div>
        </DescriptionList>
      </Card>

      <div>
        <Typography variant="bodyStrong" className="mb-2">
          Actions
        </Typography>
        <Stack gap="xs">
          <Button
            type="button"
            onClick={onAddToCart}
            disabled={!inStock}
            variant={addedToCart ? 'secondary' : 'primary'}
            size="lg"
            className="w-full"
          >
            {!inStock
              ? 'Unavailable'
              : addedToCart
                ? 'Added to cart'
                : 'Add to cart'}
          </Button>
          <Button
            type="button"
            onClick={onCopyShareLink}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            {copied ? 'Link copied' : 'Share configuration'}
          </Button>
        </Stack>
      </div>

      <Typography variant="meta" tone="muted">
        ⓘ All prices are in USD. Tax and shipping calculated at checkout.
      </Typography>
    </Stack>
  );
}
