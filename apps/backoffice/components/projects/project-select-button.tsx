'use client';

import { useTransition } from 'react';
import { Button } from '@repo/ui';
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
    <Button
      type="button"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await selectProjectAction(projectId, projectName);
        })
      }
    >
      {pending ? '…' : 'Open'}
    </Button>
  );
}
