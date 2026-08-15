export const EDITOR_EMBED = {
  AUTH: 'product-graph:editor-auth',
  READY: 'product-graph:editor-ready',
  CLOSE: 'product-graph:editor-close',
} as const;

export type EditorEmbedAuthMessage = {
  type: typeof EDITOR_EMBED.AUTH;
  token: string;
  apiUrl: string;
  graphVersionId?: string;
  userName?: string;
};
