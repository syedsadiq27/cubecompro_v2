'use client';

import { useState, useTransition } from 'react';
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
      <button
        type="button"
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
        className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {pending ? 'Publishing…' : 'Publish draft graph'}
      </button>
      {message ? (
        <p className="mt-3 text-sm text-[var(--bo-muted)]">{message}</p>
      ) : null}
    </div>
  );
}
