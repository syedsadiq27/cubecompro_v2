import { Planned } from '@/components/planned';

export const metadata = { title: 'DAM' };

export default function DamPage() {
  return (
    <Planned
      title="DAM"
      description="GLBs and textures may live in a DAM. CubeCom Pro still needs a library object id to resolve scene state."
      ships={false}
      contract="A DAM connector would ingest bytes into the project library (or store a signed fetch URL) and keep metadata in sync. Resolve and viewers continue to use library document routes. Hotlinking a DAM CDN without a library record is unsupported. No DAM connector ships in this release."
      related={[
        { href: '/platform/assets', label: 'Assets' },
        { href: '/platform/models', label: 'Models' },
      ]}
    />
  );
}
