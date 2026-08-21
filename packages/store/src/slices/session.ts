import type { GraphSessionAuth } from '@repo/product-graph';
import type { CubeSet } from '../types.js';

export type SessionProfile = {
  userName: string | null;
  email: string | null;
  role: string | null;
};

export type SessionSlice = SessionProfile & {
  graphAuth: GraphSessionAuth | null;
  setGraphAuth: (graphAuth: GraphSessionAuth | null) => void;
  setUserName: (userName: string | null) => void;
  setSession: (session: Partial<SessionProfile>) => void;
};

export const createSessionSlice = <T extends SessionSlice>(
  set: CubeSet<T>
): SessionSlice => ({
  graphAuth: null,
  userName: null,
  email: null,
  role: null,
  setGraphAuth: (graphAuth) => set({ graphAuth } as Partial<T>),
  setUserName: (userName) => set({ userName } as Partial<T>),
  setSession: (session) => set(session as Partial<T>),
});
