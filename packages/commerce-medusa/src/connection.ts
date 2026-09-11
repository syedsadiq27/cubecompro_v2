export type MedusaEngineConnection = {
  baseUrl: string;
  publishableApiKey: string;
  regionId?: string;
  currencyCode?: string;
};

export type ResolveMedusaConnection = (
  connectionRef: string
) => Promise<MedusaEngineConnection>;
