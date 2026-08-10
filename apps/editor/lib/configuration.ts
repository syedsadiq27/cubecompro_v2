import type { ProductDetail } from './api/model';

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

export function buildProductConfiguration(
  product: ProductDetail
): ProductConfiguration {
  const properties: ConfigProperty[] = [];

  for (const property of product.Properties ?? []) {
    const values: ConfigValue[] = [];
    for (const value of property.PropertyValues ?? []) {
      const objects = (value.objects ?? [])
        .filter((object) => object?.id != null)
        .map((object) => ({
          assetId: `u${object.id}`,
          objectId: object.id,
          name: object.name || `Object ${object.id}`,
          code: object.code ?? null,
        }));
      if (!objects.length && !value.name) continue;
      values.push({
        id: String(value.id),
        name: value.name || `Value ${value.id}`,
        objects,
      });
    }
    if (!values.length) continue;
    properties.push({
      id: String(property.id),
      name: property.name || `Property ${property.id}`,
      values,
    });
  }

  return { properties };
}

export function initialActiveValues(
  configuration: ProductConfiguration,
  visibleAssetIds: Set<string>
): ActiveConfigValues {
  const active: ActiveConfigValues = {};
  for (const property of configuration.properties) {
    const visibleValue = property.values.find((value) =>
      value.objects.some((object) => visibleAssetIds.has(object.assetId))
    );
    const fallback = property.values.find((value) => value.objects.length > 0);
    const value = visibleValue || fallback;
    if (value) active[property.id] = value.id;
  }
  return active;
}

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
