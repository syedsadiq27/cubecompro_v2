import { AttributeType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import {
  assertDefaultValueBelongsToAttribute,
  assertDescriptiveAttributeValueMetadata,
  assertKernelAuthoringAttributeType,
  KERNEL_AUTHORING_ATTRIBUTE_TYPE,
} from './kernel-authoring';

describe('kernel-authoring', () => {
  it('accepts SELECT only for new authoring', () => {
    expect(() =>
      assertKernelAuthoringAttributeType(AttributeType.SELECT)
    ).not.toThrow();
    expect(KERNEL_AUTHORING_ATTRIBUTE_TYPE).toBe(AttributeType.SELECT);

    for (const type of [
      AttributeType.MULTI_SELECT,
      AttributeType.BOOLEAN,
      AttributeType.NUMBER,
      AttributeType.TEXT,
    ]) {
      expect(() => assertKernelAuthoringAttributeType(type)).toThrow(
        BadRequestException
      );
    }
  });

  it('requires defaultValue to belong to the same attribute', () => {
    expect(() =>
      assertDefaultValueBelongsToAttribute({
        attributeId: 'attr_1',
        valueAttributeId: 'attr_1',
        valueId: 'val_1',
      })
    ).not.toThrow();

    expect(() =>
      assertDefaultValueBelongsToAttribute({
        attributeId: 'attr_1',
        valueAttributeId: 'attr_2',
        valueId: 'val_2',
      })
    ).toThrow(BadRequestException);
  });

  it('rejects semantic metadata keys', () => {
    expect(() =>
      assertDescriptiveAttributeValueMetadata({ swatchLabel: 'Walnut' })
    ).not.toThrow();

    expect(() =>
      assertDescriptiveAttributeValueMetadata({
        priceDelta: 200,
        mesh: 'Frame_01',
      })
    ).toThrow(BadRequestException);
  });
});
