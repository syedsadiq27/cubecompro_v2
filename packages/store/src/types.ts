import type { StoreApi } from 'zustand';

export type CubeSet<T> = StoreApi<T>['setState'];
export type CubeGet<T> = StoreApi<T>['getState'];
