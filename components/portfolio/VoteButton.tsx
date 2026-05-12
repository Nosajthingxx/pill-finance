'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  addAssetRequestAction,
  removeAssetRequestAction,
} from '@/app/portfolio/actions';

interface Props {
  ticker: string;
  voted: boolean;
}

export default function VoteButton({ ticker, voted }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      if (voted) {
        await removeAssetRequestAction(ticker);
      } else {
        const fd = new FormData();
        fd.set('ticker', ticker);
        await addAssetRequestAction(null, fd);
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`ar-vote ${voted ? 'ar-voted' : ''}`}
      aria-pressed={voted}
    >
      {pending ? '…' : voted ? 'Voted ✓' : 'Vote'}
    </button>
  );
}
