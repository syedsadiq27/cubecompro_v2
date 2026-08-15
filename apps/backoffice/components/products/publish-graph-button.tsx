'use client';

import { useState, useTransition } from 'react';
import { Button, Typography } from '@repo/ui';
import { publishProductGraphAction } from '@/actions/products';

export function PublishGraphButton({
  projectId,
  productId,
}: {
  projectId: string;
  productId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <Button
        type="button"
        size="md"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await publishProductGraphAction(projectId, productId);
            setMessage(
              result.ok
                ? 'Published draft graph.'
                : result.error || 'Publish failed.'
            );
          });
        }}
      >
        {pending ? 'Publishing…' : 'Publish draft graph'}
      </Button>
      {message ? (
        <Typography variant="support" className="mt-3">
          {message}
        </Typography>
      ) : null}
    </div>
  );
}
