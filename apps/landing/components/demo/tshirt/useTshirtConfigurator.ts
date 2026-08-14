'use client';

import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_CONFIGURATION } from './catalog';
import { resolveConfiguration } from './resolve';
import {
  applyConstraints,
  isColorDisabled,
  isFitDisabled,
  isSizeDisabled,
} from './rules';
import { encodeConfiguration } from './share';
import type {
  ColorId,
  ConfigurationState,
  FitId,
  ResolvedConfiguration,
  SizeId,
} from './types';

type UseTshirtConfiguratorArgs = {
  initialState?: ConfigurationState;
};

export function useTshirtConfigurator({
  initialState = DEFAULT_CONFIGURATION,
}: UseTshirtConfiguratorArgs = {}) {
  const [state, setState] = useState<ConfigurationState>(() =>
    applyConstraints(initialState)
  );
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const resolved: ResolvedConfiguration = useMemo(
    () => resolveConfiguration(state),
    [state]
  );

  const shareId = useMemo(
    () => encodeConfiguration(resolved.state),
    [resolved.state]
  );

  const setColor = useCallback((color: ColorId) => {
    setState((current) => applyConstraints({ ...current, color }));
    setAddedToCart(false);
  }, []);

  const setFit = useCallback((fit: FitId) => {
    setState((current) => applyConstraints({ ...current, fit }));
    setAddedToCart(false);
  }, []);

  const setSize = useCallback((size: SizeId) => {
    setState((current) => applyConstraints({ ...current, size }));
    setAddedToCart(false);
  }, []);

  const copyShareLink = useCallback(async () => {
    const url = `${window.location.origin}/demo/tshirt?c=${shareId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [shareId]);

  const addToCart = useCallback(() => {
    if (resolved.inventory <= 0) {
      return;
    }
    setAddedToCart(true);
  }, [resolved.inventory]);

  return {
    state: resolved.state,
    resolved,
    shareId,
    copied,
    addedToCart,
    setColor,
    setFit,
    setSize,
    isColorOptionDisabled: (id: ColorId) =>
      isColorDisabled(resolved.state, id),
    isFitOptionDisabled: (id: FitId) => isFitDisabled(resolved.state, id),
    isSizeOptionDisabled: (id: SizeId) => isSizeDisabled(resolved.state, id),
    copyShareLink,
    addToCart,
  };
}
