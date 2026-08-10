'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createInitialConfigurationState,
  createStubCommerceAdapter,
  createStubDecorationAdapter,
  createStubPricingAdapter,
  createValidationRegistry,
  defaultValidationRules,
  formatPrice,
  type CommerceAdapter,
  type ConfigurationState,
  type DecorationAdapter,
  type PricingAdapter,
  type ValidationResult,
} from '@repo/configurator-core';

type Adapters = {
  pricing: PricingAdapter;
  commerce: CommerceAdapter;
  decoration: DecorationAdapter;
};

type ConfigurationContextValue = {
  state: ConfigurationState;
  setState: (
    updater:
      | ConfigurationState
      | ((current: ConfigurationState) => ConfigurationState)
  ) => void;
  patchState: (partial: Partial<ConfigurationState>) => void;
  adapters: Adapters;
  priceLabel: string;
  priceResolved: boolean;
  validation: ValidationResult;
};

const ConfigurationContext = createContext<ConfigurationContextValue | null>(
  null
);

export function ConfigurationProvider({
  children,
  initialState,
  adapters,
}: {
  children: ReactNode;
  initialState?: Partial<ConfigurationState>;
  adapters?: Partial<Adapters>;
}) {
  const [state, setState] = useState(() =>
    createInitialConfigurationState(initialState)
  );

  const resolvedAdapters = useMemo<Adapters>(
    () => ({
      pricing: adapters?.pricing ?? createStubPricingAdapter(),
      commerce: adapters?.commerce ?? createStubCommerceAdapter(),
      decoration: adapters?.decoration ?? createStubDecorationAdapter(),
    }),
    [adapters]
  );

  const registry = useMemo(
    () => createValidationRegistry(defaultValidationRules),
    []
  );

  const price = resolvedAdapters.pricing.resolvePrice(state);
  const priceState = price instanceof Promise ? null : price;
  const priceLabel = priceState
    ? formatPrice(priceState)
    : formatPrice({
        base: 24,
        adjustments: [],
        total: 24,
        currency: 'USD',
        resolved: false,
      });

  const patchState = useCallback((partial: Partial<ConfigurationState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const value = useMemo<ConfigurationContextValue>(
    () => ({
      state,
      setState,
      patchState,
      adapters: resolvedAdapters,
      priceLabel,
      priceResolved: priceState?.resolved ?? false,
      validation: registry.evaluate(state),
    }),
    [
      state,
      patchState,
      resolvedAdapters,
      priceLabel,
      priceState?.resolved,
      registry,
    ]
  );

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const value = useContext(ConfigurationContext);
  if (!value) {
    throw new Error('useConfiguration must be used within ConfigurationProvider');
  }
  return value;
}
