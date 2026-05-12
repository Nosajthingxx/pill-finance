'use client';

import { useTransition } from 'react';
import { deleteTransactionAction } from '@/app/portfolio/actions';
import { useRouter } from 'next/navigation';

interface Props {
  txId: string;
}

export default function DeleteTransactionButton({ txId }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!confirm('Delete this transaction? This cannot be undone.')) return;
    startTransition(async () => {
      const result = await deleteTransactionAction(txId);
      if (result.ok) {
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      className="tx-row-delete"
      onClick={handleClick}
      disabled={pending}
      aria-label="Delete transaction"
    >
      {pending ? '…' : 'Delete'}
    </button>
  );
}
