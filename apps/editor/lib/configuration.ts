export type ConfigObjectRef = {
  assetId: string;
  objectId: number;
  name: string;
  code: string | null;
};

export type ConfigValue = {
  id: string;
  name: string;
  objects: ConfigObjectRef[];
};

export type ConfigProperty = {
  id: string;
  name: string;
  values: ConfigValue[];
};

export type ProductConfiguration = {
  properties: ConfigProperty[];
};

export type ConfigSelection = {
  propertyId: string;
  valueId: string;
};

export type ActiveConfigValues = Record<string, string>;

export function findConfigValue(
  configuration: ProductConfiguration,
  selection: ConfigSelection | null
): { property: ConfigProperty; value: ConfigValue } | null {
  if (!selection) return null;
  const property = configuration.properties.find(
    (entry) => entry.id === selection.propertyId
  );
  if (!property) return null;
  const value = property.values.find((entry) => entry.id === selection.valueId);
  if (!value) return null;
  return { property, value };
}
