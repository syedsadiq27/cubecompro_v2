'use client';

import {
  useHydrateCubeStore,
  type CubeHydrateInput,
  type CubeHydrateUnmount,
} from '@repo/store';
import type { ReactNode } from 'react';
import { useBackofficeStore } from '@/lib/backoffice-store';

export function CubeStoreHydrator({
  children,
  unmount,
  ...input
}: CubeHydrateInput & {
  children: ReactNode;
  unmount?: CubeHydrateUnmount;
}) {
  useHydrateCubeStore(useBackofficeStore.getState, input, unmount);
  return children;
}
