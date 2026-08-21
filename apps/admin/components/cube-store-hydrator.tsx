'use client';

import {
  useHydrateCubeStore,
  type CubeHydrateInput,
  type CubeHydrateUnmount,
} from '@repo/store';
import type { ReactNode } from 'react';
import { useAdminStore } from '@/lib/admin-store';

export function CubeStoreHydrator({
  children,
  unmount,
  ...input
}: CubeHydrateInput & {
  children: ReactNode;
  unmount?: CubeHydrateUnmount;
}) {
  useHydrateCubeStore(useAdminStore.getState, input, unmount);
  return children;
}
