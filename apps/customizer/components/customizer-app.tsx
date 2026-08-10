'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ConfigStepId, PriceState } from '@repo/configurator-core';
import {
  CustomizerActionBar,
  CustomizerBackButton,
  CustomizerCanvasArea,
  CustomizerContinueButton,
  CustomizerLoader,
  CustomizerPrice,
  CustomizerProductLabel,
  CustomizerProgress,
  CustomizerShell,
  CustomizerSidebar,
  CustomizerViewerControls,
  type ProgressStep,
} from '@repo/customizer-ui';
import { useModelBootstrap } from '../hooks/use-model-bootstrap';
import {
  ConfigurationProvider,
  useConfiguration,
} from '../providers/configuration-provider';
import { ThemeProvider, useTheme } from '../providers/theme-provider';
import { ColorStep } from './color-step';
import { DecorateStep } from './decorate-step';
import { ModelCanvas, type ModelSceneApi } from './model-canvas';
import { ProductStep } from './product-step';
import { ReviewStep } from './review-step';

const STEP_ORDER: ConfigStepId[] = ['product', 'color', 'decorate', 'review'];

const STEP_META: Record<
  ConfigStepId,
  { label: string; continueLabel: string; next?: ConfigStepId }
> = {
  product: {
    label: 'Product',
    continueLabel: 'Color →',
    next: 'color',
  },
  color: {
    label: 'Color',
    continueLabel: 'Decorate →',
    next: 'decorate',
  },
  decorate: {
    label: 'Decorate',
    continueLabel: 'Review →',
    next: 'review',
  },
  review: {
    label: 'Review',
    continueLabel: 'Add to cart',
  },
};

function CustomizerExperience() {
  const theme = useTheme();
  const {
    state,
    patchState,
    adapters,
    priceLabel,
    validation,
  } = useConfiguration();
  const [sceneApi, setSceneApi] = useState<ModelSceneApi | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [cartPending, setCartPending] = useState(false);
  const bootstrap = useModelBootstrap();

  useEffect(() => {
    if (bootstrap.status !== 'ready') return;
    patchState({
      productId: String(
        bootstrap.data.model.ProductId ?? bootstrap.data.model.sku
      ),
      productName:
        bootstrap.data.product.Name || `Richardson ${bootstrap.data.model.sku}`,
      sku: bootstrap.data.model.sku,
      activeStep: 'color',
      completedSteps: ['product'],
    });
  }, [bootstrap.status, patchState]);

  const progressSteps = useMemo<ProgressStep[]>(
    () =>
      STEP_ORDER.map((id, index) => {
        let status: ProgressStep['status'] = 'upcoming';
        if (id === state.activeStep) status = 'current';
        else if (state.completedSteps.includes(id)) status = 'complete';
        return {
          id,
          index: index + 1,
          label: STEP_META[id].label,
          status,
        };
      }),
    [state.activeStep, state.completedSteps]
  );

  const displayTitle = state.sku || state.productName || 'Product';

  const continueToNext = async () => {
    if (!validation.canProceed) return;

    if (state.activeStep === 'review') {
      setCartPending(true);
      setCartMessage(null);
      const price = adapters.pricing.resolvePrice(state) as PriceState;
      const result = await adapters.commerce.addToCart({
        productId: state.productId || state.sku || 'unknown',
        sku: state.sku,
        quantity: state.quantity,
        configurationId: state.configurationId,
        price,
      });
      setCartPending(false);
      setCartMessage(
        result.ok
          ? 'Added to cart'
          : result.message || 'Unable to add to cart'
      );
      return;
    }

    const meta = STEP_META[state.activeStep];
    const completed = new Set(state.completedSteps);
    completed.add(state.activeStep);
    if (meta.next) {
      patchState({
        activeStep: meta.next,
        completedSteps: Array.from(completed),
      });
    }
  };

  const goBack = () => {
    const index = STEP_ORDER.indexOf(state.activeStep);
    if (index <= 0) return;
    const previous = STEP_ORDER[index - 1];
    if (!previous) return;
    patchState({ activeStep: previous });
  };

  const selectStep = (id: string) => {
    if (!STEP_ORDER.includes(id as ConfigStepId)) return;
    patchState({ activeStep: id as ConfigStepId });
  };

  const canGoBack = STEP_ORDER.indexOf(state.activeStep) > 0;

  return (
    <CustomizerShell
      topBar={
        <CustomizerActionBar
          product={
            <CustomizerProductLabel
              title={displayTitle}
              meta={
                state.productName && state.sku !== state.productName
                  ? state.productName
                  : theme.showPoweredBy
                    ? 'Powered by CubeCom Pro'
                    : undefined
              }
            />
          }
          progress={
            <div className="flex flex-col gap-1">
              <div className="hidden md:block">
                <CustomizerProgress
                  steps={progressSteps}
                  onSelect={selectStep}
                />
              </div>
              <div className="md:hidden">
                <CustomizerProgress
                  steps={progressSteps}
                  onSelect={selectStep}
                  compact
                />
              </div>
              {cartMessage ? (
                <p className="text-xs text-white/50">{cartMessage}</p>
              ) : null}
            </div>
          }
          price={<CustomizerPrice value={priceLabel} />}
          priceHint={
            <p className="mt-1 hidden text-[0.6875rem] tracking-wide text-white/40 sm:block">
              {state.decorations.some((entry) => entry.logoName || entry.text)
                ? 'With decoration'
                : 'Base price'}
            </p>
          }
          action={
            <div className="flex items-center gap-2">
              {canGoBack ? (
                <CustomizerBackButton onClick={goBack}>
                  ← Back
                </CustomizerBackButton>
              ) : null}
              <CustomizerContinueButton
                onClick={() => {
                  void continueToNext();
                }}
                disabled={
                  bootstrap.status !== 'ready' ||
                  !validation.canProceed ||
                  cartPending
                }
              >
                {state.activeStep === 'review'
                  ? cartPending
                    ? 'Adding…'
                    : 'Add to cart'
                  : STEP_META[state.activeStep].continueLabel}
              </CustomizerContinueButton>
            </div>
          }
        />
      }
      canvas={
        <CustomizerCanvasArea
          hint={
            <p className="text-[0.6875rem] tracking-[0.12em] text-white/40 uppercase">
              Drag to rotate
            </p>
          }
          controls={
            sceneApi ? (
              <CustomizerViewerControls
                onRotate={() => sceneApi.rotate()}
                onFit={() => sceneApi.resetView()}
                onReset={() => sceneApi.resetView()}
              />
            ) : null
          }
        >
          {bootstrap.status === 'ready' ? (
            <ModelCanvas
              assets={bootstrap.data.assets}
              camera={bootstrap.data.product.camera}
              materials={bootstrap.data.materials}
              textures={bootstrap.data.textures}
              onSceneReady={setSceneApi}
            />
          ) : bootstrap.status === 'loading' ? (
            <CustomizerLoader label={`Loading model ${bootstrap.modelCode}…`} />
          ) : bootstrap.status === 'error' ? (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <div>
                <p className="text-sm font-medium text-[#ffb4a8]">
                  {bootstrap.message}
                </p>
                <p className="mt-2 text-xs text-white/45">
                  Use ?projectId=193&modelCode=112
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <p className="text-sm text-white/45">
                Add ?projectId=193&modelCode=112 to load a model
              </p>
            </div>
          )}
        </CustomizerCanvasArea>
      }
      panel={
        <CustomizerSidebar>
          {state.activeStep === 'color' && bootstrap.status === 'ready' ? (
            <ColorStep
              assets={bootstrap.data.assets}
              materials={bootstrap.data.materials}
              variants={bootstrap.data.variants}
              sceneApi={sceneApi}
            />
          ) : state.activeStep === 'decorate' ? (
            <DecorateStep sceneApi={sceneApi} />
          ) : state.activeStep === 'review' ? (
            <ReviewStep />
          ) : (
            <ProductStep />
          )}
        </CustomizerSidebar>
      }
    />
  );
}

export function CustomizerApp() {
  return (
    <ThemeProvider>
      <ConfigurationProvider>
        <CustomizerExperience />
      </ConfigurationProvider>
    </ThemeProvider>
  );
}
