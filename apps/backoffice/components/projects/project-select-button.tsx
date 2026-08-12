'use client';

import { useTransition } from 'react';
import { selectProjectAction } from '@/actions/auth';

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
      className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
    >
      {pending ? 'Opening…' : 'Open project'}
    </button>
  );
}
