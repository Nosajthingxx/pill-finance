'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { addAssetRequestAction } from '@/app/portfolio/actions';
import type { ActionResult } from '@/app/portfolio/actions';

export default function AssetRequestForm() {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    addAssetRequestAction,
    null
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="ar-form">
      <input
        type="text"
        name="ticker"
        className="tx-input ar-input"
        placeholder="e.g. SOL, EURJPY, PLTR"
        maxLength={12}
        autoComplete="off"
        required
      />
      <SubmitButton />
      {state?.ok === false && <div className="tx-fielderr ar-error">{state.error}</div>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="tx-submit ar-submit" disabled={pending}>
      {pending ? 'Adding…' : 'Submit'}
    </button>
  );
}
