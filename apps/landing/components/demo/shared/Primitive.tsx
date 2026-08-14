'use client';

import { createElement, type ReactElement } from 'react';
import type { ThreeElements } from '@react-three/fiber';

type PrimitiveProps = ThreeElements['primitive'];

export function Primitive(props: PrimitiveProps): ReactElement {
  return createElement('primitive' as never, props);
}
