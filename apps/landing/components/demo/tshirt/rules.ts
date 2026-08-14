import type {
  BlockedOptions,
  ColorId,
  ConfigurationState,
  FitId,
  SizeId,
} from './types';

export function getDisabledOptions(
  state: ConfigurationState
): BlockedOptions {
  const blocked: BlockedOptions = {
    color: [],
    fit: [],
    size: [],
  };

  if (state.fit === 'oversized') {
    blocked.size.push('s');
  }

  if (state.color === 'heather') {
    blocked.fit.push('oversized');
  }

  if (state.size === 's') {
    blocked.fit.push('oversized');
  }

  return blocked;
}

export function applyConstraints(
  next: ConfigurationState
): ConfigurationState {
  let state = { ...next };

  if (state.fit === 'oversized' && state.size === 's') {
    state = { ...state, size: 'm' };
  }

  if (state.color === 'heather' && state.fit === 'oversized') {
    state = { ...state, fit: 'regular' };
  }

  return state;
}

export function isColorDisabled(
  state: ConfigurationState,
  id: ColorId
): boolean {
  return getDisabledOptions(state).color.includes(id);
}

export function isFitDisabled(state: ConfigurationState, id: FitId): boolean {
  return getDisabledOptions(state).fit.includes(id);
}

export function isSizeDisabled(
  state: ConfigurationState,
  id: SizeId
): boolean {
  return getDisabledOptions(state).size.includes(id);
}
