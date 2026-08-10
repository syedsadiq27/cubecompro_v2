'use client';

import { useTransition } from 'react';
import { selectProjectAction } from '../../actions/auth';

export function ProjectSelectButton({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await selectProjectAction(projectId, projectName);
        })
      }
      className="rounded-xl bg-[var(--bo-ink)] px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
    >
      {pending ? 'Opening…' : 'Open project'}
    </button>
  );
}
