export const APPLICATIONS = [
  { id: 'backoffice', label: 'Backoffice', gate: 'backoffice.products' },
  { id: '3d', label: '3D Editor', gate: '3d.editor' },
  { id: '2d', label: '2D Editor', gate: '2d.editor' },
  { id: 'ai', label: 'AI', gate: 'ai.generate' },
  { id: 'api', label: 'API', gate: 'api.access' },
] as const;

export type ApplicationId = (typeof APPLICATIONS)[number]['id'];

export const CAPABILITIES = [
  {
    key: 'backoffice.products',
    shortKey: 'products',
    label: 'Backoffice products',
    application: 'backoffice',
  },
  {
    key: 'backoffice.analytics',
    shortKey: 'analytics',
    label: 'Backoffice analytics',
    application: 'backoffice',
  },
  {
    key: '3d.editor',
    shortKey: 'editor',
    label: '3D Editor',
    application: '3d',
  },
  {
    key: '3d.publish',
    shortKey: 'publish',
    label: '3D publish',
    application: '3d',
  },
  {
    key: '2d.editor',
    shortKey: 'editor',
    label: '2D Editor',
    application: '2d',
  },
  {
    key: 'ai.generate',
    shortKey: 'generate',
    label: 'AI generate',
    application: 'ai',
  },
  {
    key: 'ai.vectorize',
    shortKey: 'vectorize',
    label: 'AI vectorize',
    application: 'ai',
  },
  {
    key: 'api.access',
    shortKey: 'access',
    label: 'API access',
    application: 'api',
  },
] as const;

export const LIMITS = [
  {
    key: 'limits.products',
    shortKey: 'products',
    label: 'Products',
    unit: 'count',
    application: 'backoffice',
  },
  {
    key: 'limits.models',
    shortKey: 'models',
    label: 'Models',
    unit: 'count',
    application: '3d',
  },
  {
    key: 'limits.storage.gb',
    shortKey: 'storage.gb',
    label: 'Storage',
    unit: 'GB',
    application: '3d',
  },
  {
    key: 'limits.users',
    shortKey: 'users',
    label: 'Users',
    unit: 'count',
    application: 'backoffice',
  },
  {
    key: 'limits.projects',
    shortKey: 'projects',
    label: 'Projects',
    unit: 'count',
    application: 'backoffice',
  },
  {
    key: 'limits.ai.generations.monthly',
    shortKey: 'generations.monthly',
    label: 'AI generations',
    unit: 'month',
    application: 'ai',
  },
] as const;

export const ACCESS_TOGGLES = APPLICATIONS.map((app) => ({
  key: app.gate,
  label: app.label,
}));

export const STARTER_KEYS = [
  'backoffice.products',
  '3d.editor',
  'api.access',
] as const;

export const PRO_EXTRA_KEYS = [
  '3d.publish',
  '2d.editor',
  'ai.generate',
  'backoffice.analytics',
] as const;

export const STARTER_LIMITS: Record<string, string> = {
  'limits.products': '10',
  'limits.models': '5',
  'limits.storage.gb': '2',
  'limits.users': '3',
  'limits.projects': '2',
  'limits.ai.generations.monthly': '0',
};

export const PRO_LIMITS: Record<string, string> = {
  'limits.products': '100',
  'limits.models': '50',
  'limits.storage.gb': '20',
  'limits.users': '25',
  'limits.projects': '20',
  'limits.ai.generations.monthly': '500',
};

export function isCapabilityEnabled(value: string | undefined) {
  return value === 'true' || value === '1';
}
