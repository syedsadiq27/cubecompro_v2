import { BadRequestException } from '@nestjs/common';
import { AttributeType } from '@prisma/client';

export const KERNEL_AUTHORING_ATTRIBUTE_TYPE = AttributeType.SELECT;

const FORBIDDEN_METADATA_KEYS = new Set([
  'mesh',
  'material',
  'modelId',
  'shopifyVariantId',
  'sku',
  'price',
  'priceDelta',
  'inventory',
  'requires',
  'forbids',
  'condition',
  'effect',
]);

export function assertKernelAuthoringAttributeType(type: AttributeType): void {
  if (type !== KERNEL_AUTHORING_ATTRIBUTE_TYPE) {
    throw new BadRequestException(
      `Kernel authoring accepts AttributeType.SELECT only; refused ${type}`
    );
  }
}

export function assertDefaultValueBelongsToAttribute(input: {
  attributeId: string;
  valueAttributeId: string;
  valueId: string;
}): void {
  if (input.valueAttributeId !== input.attributeId) {
    throw new BadRequestException(
      `defaultValueId ${input.valueId} does not belong to attribute ${input.attributeId}`
    );
  }
}

export function assertDescriptiveAttributeValueMetadata(
  metadata: unknown
): void {
  if (metadata == null) return;
  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new BadRequestException('metadata must be a JSON object');
  }
  const bad = Object.keys(metadata as Record<string, unknown>).filter((key) =>
    FORBIDDEN_METADATA_KEYS.has(key)
  );
  if (bad.length > 0) {
    throw new BadRequestException(
      `AttributeValue.metadata is descriptive only; forbidden keys: ${bad.join(', ')}`
    );
  }
}
