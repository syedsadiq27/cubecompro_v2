'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MATERIAL_ASSETS_QUERY,
  graphRequest,
} from '@repo/product-graph';
import { useEditorStore } from '@/lib/editor-store';

type AssetCategory = 'materials' | 'objects' | 'textures' | 'environments';

type MaterialAssetRow = {
  id: string;
  name: string;
  code?: string | null;
  currentRevisionId?: string | null;
};

export function AssetsActionWindow() {
  const projectId = useEditorStore((state) => state.projectId);
  const graphAuth = useEditorStore((state) => state.graphAuth);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const selected = useEditorStore((state) => state.selected);

  const [category, setCategory] = useState<AssetCategory>('materials');
  const [search, setSearch] = useState('');
  const [fetchedMaterials, setFetchedMaterials] = useState<MaterialAssetRow[]>([]);

  useEffect(() => {
    if (!projectId || !graphAuth) return;
    let cancelled = false;
    void graphRequest<{ materialAssets: MaterialAssetRow[] }>(
      MATERIAL_ASSETS_QUERY,
      { projectId },
      graphAuth.token,
      graphAuth.apiUrl
    )
      .then((data) => {
        if (!cancelled && data.materialAssets) {
          setFetchedMaterials(data.materialAssets);
        }
      })
      .catch(() => {
        /* fallback to sample */
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, graphAuth]);

  const defaultMaterials = [
    { id: 'mat-1', name: 'American Walnut v4', code: 'WAL-04', type: 'Wood PBR', swatch: 'radial-gradient(circle at 35% 35%, #8A6040, #5C3D24 60%, #2B1B10 100%)' },
    { id: 'mat-2', name: 'Natural White Oak', code: 'OAK-01', type: 'Wood PBR', swatch: 'radial-gradient(circle at 35% 35%, #C8A265, #A47F46 60%, #634823 100%)' },
    { id: 'mat-3', name: 'Carrara White Marble', code: 'MRB-03', type: 'Stone PBR', swatch: 'radial-gradient(circle at 35% 35%, #F8FAFC, #E2E8F0 60%, #94A3B8 100%)' },
    { id: 'mat-4', name: 'Brushed Brass', code: 'BRS-02', type: 'Metal PBR', swatch: 'radial-gradient(circle at 35% 35%, #FFE082, #D4AF37 60%, #7A5B0B 100%)' },
    { id: 'mat-5', name: 'Matte Black Powdercoat', code: 'BLK-01', type: 'Metal PBR', swatch: 'radial-gradient(circle at 35% 35%, #4B4B52, #232328 60%, #0C0C0E 100%)' },
    { id: 'mat-6', name: 'Polished Stainless Steel', code: 'STL-01', type: 'Metal PBR', swatch: 'radial-gradient(circle at 35% 35%, #FFFFFF, #CBD5E1 60%, #64748B 100%)' },
  ];

  const materials = useMemo(() => {
    if (fetchedMaterials.length > 0) {
      return fetchedMaterials.map((m) => {
        const lower = m.name.toLowerCase();
        let swatch = 'radial-gradient(circle at 35% 35%, #8A6040, #5C3D24 60%, #2B1B10 100%)';
        if (lower.includes('oak')) swatch = 'radial-gradient(circle at 35% 35%, #C8A265, #A47F46 60%, #634823 100%)';
        if (lower.includes('marble')) swatch = 'radial-gradient(circle at 35% 35%, #F8FAFC, #E2E8F0 60%, #94A3B8 100%)';
        if (lower.includes('brass') || lower.includes('gold')) swatch = 'radial-gradient(circle at 35% 35%, #FFE082, #D4AF37 60%, #7A5B0B 100%)';
        if (lower.includes('black')) swatch = 'radial-gradient(circle at 35% 35%, #4B4B52, #232328 60%, #0C0C0E 100%)';
        return {
          id: m.id,
          name: m.name,
          code: m.code || 'MAT',
          type: 'PBR Material',
          swatch,
        };
      });
    }
    return defaultMaterials;
  }, [fetchedMaterials]);

  const handleSelectMaterial = (mat: { id: string; name: string }) => {
    if (selected) {
      setStatusMessage(`Applied ${mat.name} to ${selected.name}`);
    } else {
      setStatusMessage(`Selected ${mat.name}. Select a mesh in scene to assign.`);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#101116] border-t border-white/10 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 shrink-0 bg-[#0E0F12]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[13px] text-white">Asset Registry & Materials</span>
          <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-xl border border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => setCategory('materials')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                category === 'materials'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Materials ({materials.length})
            </button>
            <button
              type="button"
              onClick={() => setCategory('objects')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                category === 'objects'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Objects (4)
            </button>
            <button
              type="button"
              onClick={() => setCategory('textures')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                category === 'textures'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Textures (12)
            </button>
            <button
              type="button"
              onClick={() => setCategory('environments')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                category === 'environments'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              HDRI Envs (2)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusMessage('Import new asset')}
            className="flex items-center gap-1.5 rounded-xl border border-[#665CFF]/60 bg-[#232549] px-3 py-1.5 text-[11px] font-medium text-[#9D95FF] hover:bg-[#2E2A59] transition-colors"
          >
            <span>+ Import Asset</span>
          </button>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {materials.map((mat) => (
            <div
              key={mat.id}
              onClick={() => handleSelectMaterial(mat)}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-[#16171E] p-3 space-y-2 hover:border-[#665CFF]/60 hover:bg-[#1B1D28] transition-all shadow-xs"
            >
              <div
                className="h-16 w-full rounded-xl border border-white/15 shadow-inner flex items-center justify-center"
                style={{ background: mat.swatch }}
              />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white group-hover:text-[#9D95FF] transition-colors">
                  {mat.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-white/40 mt-0.5">
                  <span>{mat.code}</span>
                  <span>{mat.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
