import type {
  BlockedOptions,
  ConfigurationState,
  FabricId,
  FrameId,
  LegsId,
} from './types';

export function getDisabledOptions(
  state: ConfigurationState
): BlockedOptions {
  const blocked: BlockedOptions = {
    frame: [],
    fabric: [],
    legs: [],
  };

  if (state.fabric === 'leather') {
    blocked.frame.push('black');
  }

  if (state.frame === 'black') {
    blocked.fabric.push('forest');
    blocked.legs.push('brass');
  }

  return blocked;
}

export function applyConstraints(
  next: ConfigurationState
): ConfigurationState {
  let state = { ...next };

  if (state.fabric === 'leather' && state.frame === 'black') {
    state = { ...state, frame: 'walnut' };
  }

  if (state.frame === 'black' && state.fabric === 'forest') {
    state = { ...state, fabric: 'beige' };
  }

  if (state.frame === 'black' && state.legs === 'brass') {
    state = { ...state, legs: 'black-steel' };
  }

  return state;
}

export function isFrameDisabled(
  state: ConfigurationState,
  id: FrameId
): boolean {
  return getDisabledOptions(state).frame.includes(id);
}

export function isFabricDisabled(
  state: ConfigurationState,
  id: FabricId
): boolean {
  return getDisabledOptions(state).fabric.includes(id);
}

export function isLegsDisabled(
  state: ConfigurationState,
  id: LegsId
): boolean {
  return getDisabledOptions(state).legs.includes(id);
}
