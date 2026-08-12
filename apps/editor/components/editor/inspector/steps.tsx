'use client';

import * as THREE from 'three';
import { useEffect, useState } from 'react';
import {
  countGeometry,
  objectLabel,
  readMaterialName,
} from '@/lib/inspector/context';
import type { InspectorRuntimeContext } from '@/lib/inspector/types';
import { useEditorStore } from '@/lib/editor-store';
import {
  FieldLabel,
  KeyValue,
  NumberField,
  RowButton,
  SelectField,
} from './fields';

export function ModelStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const doc = ctx.document;
  if (!doc) {
    return <p className="type-meta">Load a model to inspect.</p>;
  }
  return (
    <div className="space-y-3">
      <div className="rounded-[8px] border border-[var(--line)] px-3 py-2.5">
        <p className="text-[13px] font-medium text-[var(--ink)]">
          {doc.modelName}
        </p>
        <p className="type-meta mt-1">
          {doc.modelSku || `Model ${doc.modelId}`}
        </p>
      </div>
      <KeyValue label="Product" value={`${doc.productCode} · ${doc.productName}`} />
      <KeyValue label="Objects" value={doc.objectCount} />
      <KeyValue label="Meshes" value={doc.meshCount} />
    </div>
  );
}

export function TransformStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const selected = ctx.selected;
  const updateSelectedTransform = useEditorStore(
    (state) => state.updateSelectedTransform
  );
  void ctx.selectionRevision;
  if (!selected) return null;

  return (
    <div className="space-y-3">
      <FieldLabel>Position</FieldLabel>
      <NumberField
        label="X"
        value={selected.position.x}
        onChange={(value) =>
          updateSelectedTransform({
            position: [value, selected.position.y, selected.position.z],
          })
        }
      />
      <NumberField
        label="Y"
        value={selected.position.y}
        onChange={(value) =>
          updateSelectedTransform({
            position: [selected.position.x, value, selected.position.z],
          })
        }
      />
      <NumberField
        label="Z"
        value={selected.position.z}
        onChange={(value) =>
          updateSelectedTransform({
            position: [selected.position.x, selected.position.y, value],
          })
        }
      />
      <FieldLabel>Rotation</FieldLabel>
      <NumberField
        label="X"
        value={selected.rotation.x}
        onChange={(value) =>
          updateSelectedTransform({
            rotation: [value, selected.rotation.y, selected.rotation.z],
          })
        }
      />
      <NumberField
        label="Y"
        value={selected.rotation.y}
        onChange={(value) =>
          updateSelectedTransform({
            rotation: [selected.rotation.x, value, selected.rotation.z],
          })
        }
      />
      <NumberField
        label="Z"
        value={selected.rotation.z}
        onChange={(value) =>
          updateSelectedTransform({
            rotation: [selected.rotation.x, selected.rotation.y, value],
          })
        }
      />
      <FieldLabel>Scale</FieldLabel>
      <NumberField
        label="X"
        value={selected.scale.x}
        onChange={(value) =>
          updateSelectedTransform({
            scale: [value, selected.scale.y, selected.scale.z],
          })
        }
      />
      <NumberField
        label="Y"
        value={selected.scale.y}
        onChange={(value) =>
          updateSelectedTransform({
            scale: [selected.scale.x, value, selected.scale.z],
          })
        }
      />
      <NumberField
        label="Z"
        value={selected.scale.z}
        onChange={(value) =>
          updateSelectedTransform({
            scale: [selected.scale.x, selected.scale.y, value],
          })
        }
      />
    </div>
  );
}

export function VisibilityStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const selected = ctx.selected;
  const setObjectVisible = useEditorStore((state) => state.setObjectVisible);
  void ctx.selectionRevision;
  if (!selected) return null;
  return (
    <label className="flex items-center justify-between gap-3 text-[12px]">
      <span className="text-[var(--text-muted)]">Visible</span>
      <input
        type="checkbox"
        checked={selected.visible}
        onChange={(event) => setObjectVisible(selected, event.target.checked)}
      />
    </label>
  );
}

export function GeometryStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const selected = ctx.selected;
  void ctx.selectionRevision;
  if (!selected) return null;
  const stats = countGeometry(selected);
  const box = new THREE.Box3().setFromObject(selected);
  const size = box.getSize(new THREE.Vector3());
  return (
    <div className="space-y-2">
      <KeyValue label="Name" value={objectLabel(selected)} />
      <KeyValue label="Type" value={selected.type} />
      <KeyValue label="Meshes" value={stats.meshes} />
      <KeyValue label="Triangles" value={stats.triangles} />
      <KeyValue
        label="Bounds"
        value={`${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}`}
      />
    </div>
  );
}

export function ColorStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const selected = ctx.selected;
  const setSelectedColor = useEditorStore((state) => state.setSelectedColor);
  const openDrawer = useEditorStore((state) => state.openDrawer);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [color, setColor] = useState('#ffffff');
  const [source, setSource] = useState('library');

  useEffect(() => {
    if (!selected) return;
    let found: string | null = null;
    selected.traverse((node) => {
      if (found) return;
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const material = Array.isArray(mesh.material)
        ? mesh.material[0]
        : mesh.material;
      if (material && 'color' in material && material.color instanceof THREE.Color) {
        found = `#${material.color.getHexString()}`;
      }
    });
    if (found) setColor(found);
  }, [selected, ctx.selectionRevision]);

  const swatches = ['#111111', '#1f3a5f', '#f5f5f5', color];

  return (
    <div className="space-y-3">
      <SelectField
        label="Color source"
        value={source}
        options={[
          { value: 'library', label: 'Library' },
          { value: 'custom', label: 'Custom' },
        ]}
        onChange={setSource}
      />
      <div>
        <FieldLabel>Available colors</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {swatches.map((swatch, index) => (
            <button
              key={`${swatch}-${index}`}
              type="button"
              onClick={() => {
                setColor(swatch);
                if (selected) setSelectedColor(swatch);
              }}
              className="h-7 w-7 rounded-full border border-[var(--line)]"
              style={{ backgroundColor: swatch }}
              aria-label={`Color ${swatch}`}
            />
          ))}
        </div>
      </div>
      <label className="flex items-center justify-between gap-3 text-[12px]">
        <span className="text-[var(--text-muted)]">Custom</span>
        <input
          type="color"
          value={color}
          onChange={(event) => {
            setColor(event.target.value);
            if (selected) setSelectedColor(event.target.value);
          }}
          className="h-8 w-12 cursor-pointer rounded border border-[var(--line)] bg-white"
        />
      </label>
      <KeyValue label="Applies to" value={objectLabel(selected)} />
      <RowButton
        label="Library"
        value="Browse colors"
        onClick={() => {
          openDrawer('colors');
          setStatusMessage('Color library drawer is a shell for now.');
        }}
      />
    </div>
  );
}

export function MaterialStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const selected = ctx.selected;
  const openDrawer = useEditorStore((state) => state.openDrawer);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  void ctx.selectionRevision;

  let roughness = 0.5;
  let metalness = 0;
  let opacity = 1;
  if (selected) {
    selected.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const material = Array.isArray(mesh.material)
        ? mesh.material[0]
        : mesh.material;
      if (material && 'roughness' in material) {
        roughness = Number((material as THREE.MeshStandardMaterial).roughness);
        metalness = Number((material as THREE.MeshStandardMaterial).metalness);
        opacity = Number(material.opacity);
      }
    });
  }

  const name = readMaterialName(selected) || 'Assigned material';

  return (
    <div className="space-y-3">
      <KeyValue label="Current" value={name} />
      <RowButton
        label="Library"
        value="Browse materials"
        onClick={() => {
          openDrawer('materials');
          setStatusMessage('Material library drawer is a shell for now.');
        }}
      />
      <FieldLabel>Properties</FieldLabel>
      <KeyValue label="Roughness" value={roughness.toFixed(2)} />
      <KeyValue label="Metalness" value={metalness.toFixed(2)} />
      <KeyValue label="Opacity" value={opacity.toFixed(2)} />
    </div>
  );
}

export function TextureStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const openDrawer = useEditorStore((state) => state.openDrawer);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  void ctx;
  return (
    <div className="space-y-3">
      <KeyValue label="Base map" value="—" />
      <KeyValue label="Normal map" value="—" />
      <KeyValue label="Roughness map" value="—" />
      <RowButton
        label="Library"
        value="Browse textures"
        onClick={() => {
          openDrawer('textures');
          setStatusMessage('Texture library drawer is a shell for now.');
        }}
      />
    </div>
  );
}

export function ShadowStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const selected = ctx.selected;
  const bumpSelection = useEditorStore((state) => state.bumpSelection);
  void ctx.selectionRevision;
  if (!selected) return null;

  let castShadow = false;
  let receiveShadow = false;
  selected.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    castShadow = castShadow || mesh.castShadow;
    receiveShadow = receiveShadow || mesh.receiveShadow;
  });

  const setShadow = (key: 'castShadow' | 'receiveShadow', value: boolean) => {
    selected.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh[key] = value;
    });
    bumpSelection();
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between gap-3 text-[12px]">
        <span className="text-[var(--text-muted)]">Cast shadow</span>
        <input
          type="checkbox"
          checked={castShadow}
          onChange={(event) => setShadow('castShadow', event.target.checked)}
        />
      </label>
      <label className="flex items-center justify-between gap-3 text-[12px]">
        <span className="text-[var(--text-muted)]">Receive shadow</span>
        <input
          type="checkbox"
          checked={receiveShadow}
          onChange={(event) => setShadow('receiveShadow', event.target.checked)}
        />
      </label>
    </div>
  );
}

export function LocationStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const selected = ctx.selected;
  const [region, setRegion] = useState('front');
  void ctx.selectionRevision;
  return (
    <div className="space-y-3">
      <KeyValue label="Target" value={objectLabel(selected)} />
      <SelectField
        label="Region"
        value={region}
        options={[
          { value: 'front', label: 'Front panel' },
          { value: 'back', label: 'Back panel' },
          { value: 'visor', label: 'Visor' },
          { value: 'side', label: 'Side' },
        ]}
        onChange={setRegion}
      />
      <FieldLabel>Anchor</FieldLabel>
      <NumberField label="X" value={selected?.position.x ?? 0.42} onChange={() => undefined} />
      <NumberField label="Y" value={selected?.position.y ?? 0.18} onChange={() => undefined} />
      <KeyValue label="Scale" value="100%" />
      <KeyValue label="Rotation" value="0°" />
    </div>
  );
}

export function DecorationStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  void ctx;
  return (
    <div className="space-y-3">
      <KeyValue label="Type" value="Logo" />
      <KeyValue label="Artwork" value="—" />
      <KeyValue label="Method" value="Embroidery" />
      <KeyValue label="Placement" value="Front center" />
      <KeyValue label="Size" value="85 × 32 mm" />
    </div>
  );
}

export function RulesStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const count = ctx.document?.ruleCount ?? 0;
  return (
    <div className="space-y-3">
      <KeyValue label="Rules" value={count} />
      <p className="type-meta">
        Conditional visibility and mapped values will edit here.
      </p>
    </div>
  );
}

export function CommerceStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const doc = ctx.document;
  return (
    <div className="space-y-3">
      <KeyValue label="SKU" value={doc?.modelSku || '—'} />
      <KeyValue label="Product" value={doc?.productCode || '—'} />
      <KeyValue label="Option mapping" value="—" />
      <KeyValue label="Variant mapping" value="—" />
    </div>
  );
}

export function SceneStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const doc = ctx.document;
  return (
    <div className="space-y-2">
      <KeyValue label="Objects" value={doc?.objectCount ?? 0} />
      <KeyValue label="Meshes" value={doc?.meshCount ?? 0} />
      <KeyValue label="Materials" value={doc?.materialCount ?? 0} />
      <KeyValue label="Rules" value={doc?.ruleCount ?? 0} />
    </div>
  );
}

export function EnvironmentStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  const openDrawer = useEditorStore((state) => state.openDrawer);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  void ctx;
  return (
    <div className="space-y-3">
      <RowButton
        label="HDRI"
        value="Studio Soft"
        onClick={() => {
          openDrawer('lights');
          setStatusMessage('Environment drawer is a shell for now.');
        }}
      />
      <KeyValue label="Exposure" value="1.0" />
    </div>
  );
}

export function CameraStep({ ctx }: { ctx: InspectorRuntimeContext }) {
  void ctx;
  return (
    <div className="space-y-2">
      <KeyValue label="Projection" value="Perspective" />
      <p className="type-meta">
        Framing comes from product camera config. Presets live on the stage
        toolbar.
      </p>
    </div>
  );
}
