'use client';

import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_CONFIGURATION } from './catalog';
import { resolveConfiguration } from './resolve';
import {
  applyConstraints,
  isFabricDisabled,
  isFrameDisabled,
  isLegsDisabled,
} from './rules';
import { encodeConfiguration } from './share';
import type {
  ConfigurationState,
  FabricId,
  FrameId,
  LegsId,
  ResolvedConfiguration,
} from './types';

type UseSofaConfiguratorArgs = {
  initialState?: ConfigurationState;
};

export function useSofaConfigurator({
  initialState = DEFAULT_CONFIGURATION,
}: UseSofaConfiguratorArgs = {}) {
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

  const setFrame = useCallback((frame: FrameId) => {
    setState((current) => applyConstraints({ ...current, frame }));
    setAddedToCart(false);
  }, []);

  const setFabric = useCallback((fabric: FabricId) => {
    setState((current) => applyConstraints({ ...current, fabric }));
    setAddedToCart(false);
  }, []);

  const setLegs = useCallback((legs: LegsId) => {
    setState((current) => applyConstraints({ ...current, legs }));
    setAddedToCart(false);
  }, []);

  const isFrameOptionDisabled = useCallback(
    (id: FrameId) => isFrameDisabled(resolved.state, id),
    [resolved.state]
  );

  const isFabricOptionDisabled = useCallback(
    (id: FabricId) => isFabricDisabled(resolved.state, id),
    [resolved.state]
  );

  const isLegsOptionDisabled = useCallback(
    (id: LegsId) => isLegsDisabled(resolved.state, id),
    [resolved.state]
  );

  const copyShareLink = useCallback(async () => {
    const url = `${window.location.origin}/demo?c=${shareId}`;
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
    setFrame,
    setFabric,
    setLegs,
    isFrameOptionDisabled,
    isFabricOptionDisabled,
    isLegsOptionDisabled,
    copyShareLink,
    addToCart,
  };
}
