'use client';

import { create } from 'zustand';
import { composeCubeSlices, type CubeStore } from './compose.js';

export function createCubeStore() {
  return create<CubeStore>()((set, get) => composeCubeSlices(set, get));
}
