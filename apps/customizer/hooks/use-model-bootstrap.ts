'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  bootstrapModelFromParams,
  type BootstrapModelResult,
} from '../lib/bootstrap-model';
import { parseCustomizerSearchParams } from '../lib/url-params';

export type ModelBootstrapState =
  | { status: 'idle' }
  | { status: 'loading'; projectId: string; modelCode: string }
  | { status: 'ready'; data: BootstrapModelResult }
  | { status: 'error'; message: string; projectId: string; modelCode: string | null };

export function useModelBootstrap(): ModelBootstrapState {
  const searchParams = useSearchParams();
  const { projectId, modelCode } = parseCustomizerSearchParams(searchParams);
  const [state, setState] = useState<ModelBootstrapState>(
    modelCode
      ? { status: 'loading', projectId, modelCode }
      : { status: 'idle' }
  );

  useEffect(() => {
    if (!modelCode) {
      setState({ status: 'idle' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading', projectId, modelCode });

    bootstrapModelFromParams({ projectId, modelCode })
      .then((data) => {
        if (cancelled) return;
        setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : 'Failed to bootstrap model';
        setState({ status: 'error', message, projectId, modelCode });
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, modelCode]);

  return state;
}
